// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Pharmacy Supply Chain Smart Contract
/// @notice Quản lý chuỗi cung ứng dược phẩm với 3 actor: Manufacturer, Distributor, Pharmacy
/// @dev Deploy lên Ganache bằng Remix IDE hoặc Hardhat

contract SupplyChain {

    // ─────────────────────────────────────────────
    //  ENUMS & STRUCTS
    // ─────────────────────────────────────────────

    enum Role   { None, Manufacturer, Distributor, Pharmacy }
    enum Status { Produced, InTransit, Delivered }

    struct Medicine {
        uint256 id;
        string  name;
        string  batchNumber;       // Số lô sản xuất
        uint256 productionDate;    // Unix timestamp
        uint256 expiryDate;        // Unix timestamp
        address currentOwner;
        Status  status;
        address[] history;         // Lịch sử các ví đã cầm lô thuốc
        string[]  statusHistory;   // Mô tả trạng thái tương ứng mỗi lần chuyển
    }

    struct Actor {
        address wallet;
        string  name;
        Role    role;
        bool    isRegistered;
    }

    // ─────────────────────────────────────────────
    //  STATE VARIABLES
    // ─────────────────────────────────────────────

    address public owner;                              // Contract deployer (Admin)
    mapping(uint256 => Medicine) public medicines;     // id => Medicine
    mapping(address => Actor)    public actors;        // wallet => Actor
    uint256[] public medicineIds;                      // Danh sách tất cả medicine ID

    // ─────────────────────────────────────────────
    //  EVENTS
    // ─────────────────────────────────────────────

    event ActorRegistered(address indexed wallet, string name, Role role);
    event MedicineAdded(uint256 indexed id, string name, string batchNumber, address manufacturer);
    event ItemTransferred(uint256 indexed id, address indexed from, address indexed to, Status newStatus);
    event ItemDelivered(uint256 indexed id, address indexed pharmacy);

    // ─────────────────────────────────────────────
    //  MODIFIERS
    // ─────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "Chi Admin moi co quyen");
        _;
    }

    modifier onlyRegistered() {
        require(actors[msg.sender].isRegistered, "Ban chua duoc dang ky trong he thong");
        _;
    }

    modifier onlyManufacturer() {
        require(actors[msg.sender].role == Role.Manufacturer, "Chi Nha san xuat moi co quyen");
        _;
    }

    modifier medicineExists(uint256 _id) {
        require(medicines[_id].id == _id && medicines[_id].productionDate != 0,
                "Thuoc khong ton tai");
        _;
    }

    // ─────────────────────────────────────────────
    //  CONSTRUCTOR
    // ─────────────────────────────────────────────

    constructor() {
        owner = msg.sender;
        // Tự đăng ký Admin như một actor đặc biệt
        actors[msg.sender] = Actor(msg.sender, "Admin", Role.None, true);
    }

    // ─────────────────────────────────────────────
    //  ACTOR MANAGEMENT
    // ─────────────────────────────────────────────

    /// @notice Admin đăng ký một actor mới vào hệ thống
    /// @param _wallet   Địa chỉ ví của actor
    /// @param _name     Tên tổ chức / cá nhân
    /// @param _role     1 = Manufacturer | 2 = Distributor | 3 = Pharmacy
    function registerActor(
        address _wallet,
        string memory _name,
        Role _role
    ) public onlyOwner {
        require(_wallet != address(0),              "Dia chi vi khong hop le");
        require(!actors[_wallet].isRegistered,      "Actor da duoc dang ky");
        require(_role != Role.None,                 "Role khong hop le");

        actors[_wallet] = Actor(_wallet, _name, _role, true);
        emit ActorRegistered(_wallet, _name, _role);
    }

    // ─────────────────────────────────────────────
    //  CORE FUNCTIONS
    // ─────────────────────────────────────────────

    /// @notice Nhà sản xuất tạo mới một lô thuốc
    /// @param _id              ID định danh duy nhất của lô thuốc
    /// @param _name            Tên thuốc
    /// @param _batchNumber     Số lô (vd: "BATCH-2024-001")
    /// @param _expiryDate      Ngày hết hạn (Unix timestamp)
    function addMedicine(
        uint256 _id,
        string memory _name,
        string memory _batchNumber,
        uint256 _expiryDate
    ) public onlyRegistered onlyManufacturer {
        require(medicines[_id].productionDate == 0, "ID thuoc da ton tai");
        require(bytes(_name).length > 0,             "Ten thuoc khong duoc trong");
        require(_expiryDate > block.timestamp,       "Ngay het han phai lon hon hien tai");

        // Khởi tạo dynamic arrays trước
        address[] memory h = new address[](0);
        string[]  memory s = new string[](0);

        medicines[_id] = Medicine({
            id:             _id,
            name:           _name,
            batchNumber:    _batchNumber,
            productionDate: block.timestamp,
            expiryDate:     _expiryDate,
            currentOwner:   msg.sender,
            status:         Status.Produced,
            history:        h,
            statusHistory:  s
        });

        // Ghi nhận lịch sử ban đầu
        medicines[_id].history.push(msg.sender);
        medicines[_id].statusHistory.push("Produced by Manufacturer");

        medicineIds.push(_id);

        emit MedicineAdded(_id, _name, _batchNumber, msg.sender);
    }

    /// @notice Chuyển giao quyền sở hữu lô thuốc (Manufacturer→Distributor hoặc Distributor→Pharmacy)
    /// @param _id          ID lô thuốc
    /// @param _newOwner    Địa chỉ ví người nhận
    function transferItem(
        uint256 _id,
        address _newOwner
    ) public onlyRegistered medicineExists(_id) {
        Medicine storage med = medicines[_id];

        require(med.currentOwner == msg.sender,        "Ban khong so huu lo thuoc nay");
        require(actors[_newOwner].isRegistered,        "Nguoi nhan chua duoc dang ky");
        require(med.status != Status.Delivered,        "Lo thuoc da duoc giao den dich");
        require(block.timestamp < med.expiryDate,      "Lo thuoc da het han");

        // Kiểm tra luồng hợp lệ:
        // Manufacturer (role=1) → chỉ chuyển cho Distributor (role=2)
        // Distributor  (role=2) → chỉ chuyển cho Pharmacy    (role=3)
        Role senderRole   = actors[msg.sender].role;
        Role receiverRole = actors[_newOwner].role;

        if (senderRole == Role.Manufacturer) {
            require(receiverRole == Role.Distributor,
                    "Nha san xuat chi duoc chuyen cho Nha phan phoi");
        } else if (senderRole == Role.Distributor) {
            require(receiverRole == Role.Pharmacy,
                    "Nha phan phoi chi duoc chuyen cho Nha thuoc");
        } else {
            revert("Pharmacy khong the chuyen tiep thuoc");
        }

        // Cập nhật trạng thái
        Status newStatus = (receiverRole == Role.Pharmacy)
            ? Status.Delivered
            : Status.InTransit;

        med.currentOwner = _newOwner;
        med.status       = newStatus;
        med.history.push(_newOwner);

        string memory note = (newStatus == Status.Delivered)
            ? "Delivered to Pharmacy"
            : "In Transit to Distributor";
        med.statusHistory.push(note);

        emit ItemTransferred(_id, msg.sender, _newOwner, newStatus);

        if (newStatus == Status.Delivered) {
            emit ItemDelivered(_id, _newOwner);
        }
    }

    // ─────────────────────────────────────────────
    //  VIEW / QUERY FUNCTIONS
    // ─────────────────────────────────────────────

    /// @notice Lấy toàn bộ lịch sử chuyển giao của một lô thuốc
    /// @param _id  ID lô thuốc
    /// @return wallets  Danh sách địa chỉ ví theo thứ tự thời gian
    /// @return notes    Mô tả trạng thái tương ứng
    function getMedicineHistory(uint256 _id)
        public
        view
        medicineExists(_id)
        returns (address[] memory wallets, string[] memory notes)
    {
        return (medicines[_id].history, medicines[_id].statusHistory);
    }

    /// @notice Lấy thông tin chi tiết một lô thuốc
    function getMedicine(uint256 _id)
        public
        view
        medicineExists(_id)
        returns (
            uint256 id,
            string memory name,
            string memory batchNumber,
            uint256 productionDate,
            uint256 expiryDate,
            address currentOwner,
            Status  status
        )
    {
        Medicine storage m = medicines[_id];
        return (m.id, m.name, m.batchNumber, m.productionDate, m.expiryDate, m.currentOwner, m.status);
    }

    /// @notice Kiểm tra tính hợp lệ của lô thuốc
    /// @return isValid true nếu chưa hết hạn và đã được giao đúng đích
    function verifyMedicine(uint256 _id)
        public
        view
        medicineExists(_id)
        returns (bool isValid, string memory message)
    {
        Medicine storage m = medicines[_id];

        if (block.timestamp >= m.expiryDate) {
            return (false, "Lo thuoc da het han su dung");
        }
        if (m.status != Status.Delivered) {
            return (false, "Lo thuoc chua duoc giao den Nha thuoc");
        }
        return (true, "Lo thuoc hop le va da duoc giao thanh cong");
    }

    /// @notice Lấy tất cả medicine ID đã tạo
    function getAllMedicineIds() public view returns (uint256[] memory) {
        return medicineIds;
    }
}
