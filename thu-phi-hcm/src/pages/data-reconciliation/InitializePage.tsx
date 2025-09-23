import React, { useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { CrmApiService } from "../../utils/crmApi";
import { useNotification } from "../../context/NotificationContext";

interface ReconciliationData {
  id: string;
  name: string;
  fromDate: string;
  toDate: string;
  dataSource: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  createdBy: string;
  description: string;
  matchRate?: number;
}

interface DoiSoatDetail {
  id: number;
  pkgId: number | null;
  lanDs: number;
  soBk: string;
  ngayBk: string;
  ngayDs: string;
  tongSo: number;
  trangThai: string;
  nhDs: string;
  kbDs: string;
  tongSoTkDds: number | null;
  chiTietList: ChiTietDoiSoat[];
  tongTien: string;
}

interface ChiTietDoiSoat {
  id: number;
  doiSoatId: number;
  stoKhaiId: number;
  soToKhai: string;
  ngayToKhai: string;
  soTnKp: string;
  ngayTnKp: string;
  maDoanhNghiep: string;
  tenDoanhNghiep: string;
  transId: string;
  nganHang: string;
  nhDs: string;
  kbDs: string;
  ghiChu: string;
  tongTienPhi: string;
}

const InitializePage: React.FC = () => {
  const [searchDate, setSearchDate] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ReconciliationData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [doiSoatDetail, setDoiSoatDetail] = useState<DoiSoatDetail | null>(
    null
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const [showRunModal, setShowRunModal] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [runDate, setRunDate] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportData, setExportData] = useState({
    tuNgay: "",
    denNgay: "",
    nganHang: "",
    nhDs: "",
    kbDs: "",
    trangThai: "",
  });
  const [showMasterDetailModal, setShowMasterDetailModal] = useState(false);
  const [masterDetailLoading, setMasterDetailLoading] = useState(false);
  const [masterDetailData, setMasterDetailData] = useState({
    tuNgay: "",
    denNgay: "",
    nganHang: "",
    nhDs: "",
    kbDs: "",
    trangThai: "",
  });
  const [showBankReconcileModal, setShowBankReconcileModal] = useState(false);
  const [bankReconcileLoading, setBankReconcileLoading] = useState(false);
  const [bankReconcileData, setBankReconcileData] = useState({
    reconcileDate: "",
    bankCode: "",
    bankName: "",
    unitCode: "",
    unitName: "",
    totalTransaction: 0,
    totalAmount: 0,
    transactions: [] as Array<{
      transId: string;
      toKhaiId: string;
      amount: number;
      status: string;
      payTime: string;
      sendToKBNNStatus: string;
      remark: string;
    }>,
  });
  const [showKbReconcileModal, setShowKbReconcileModal] = useState(false);
  const [kbReconcileLoading, setKbReconcileLoading] = useState(false);
  const [kbReconcileData, setKbReconcileData] = useState({
    reconcileDate: "",
    totalTransaction: 0,
    totalAmount: 0,
    transactions: [] as Array<{
      transId: string;
      amount: number;
    }>,
  });
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    reconciliationName: "",
    fromDate: "",
    toDate: "",
    description: "",
    dataSource: "system",
  });

  // Mock data - để trống bảng
  const [reconciliationData, setReconciliationData] = useState<
    ReconciliationData[]
  >([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Chờ xử lý",
      },
      processing: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Đang xử lý",
      },
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Hoàn thành",
      },
      failed: { bg: "bg-red-100", text: "text-red-800", label: "Thất bại" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getDataSourceLabel = (source: string) => {
    const sourceConfig = {
      system: "Hệ thống nội bộ",
      customs: "Dữ liệu Hải Quan",
      bank: "Dữ liệu ngân hàng",
      manual: "Nhập thủ công",
    };
    return sourceConfig[source as keyof typeof sourceConfig] || source;
  };

  const handleSearch = async () => {
    if (!searchDate) {
      showError("Vui lòng chọn ngày để tìm kiếm");
      return;
    }

    try {
      setLoading(true);
      const response = await CrmApiService.searchDoiSoat(
        searchDate,
        searchDate
      );

      if (response.status === 200 && response.data) {
        // Chuyển đổi dữ liệu từ API sang format ReconciliationData
        const apiData = response.data.map((item: any, index: number) => ({
          id: item.id || `api-${index}`,
          name: item.name || item.tenDoiSoat || `Đối soát ${index + 1}`,
          fromDate: item.fromDate || item.tuNgay || searchDate,
          toDate: item.toDate || item.denNgay || searchDate,
          dataSource: item.dataSource || item.nguonDuLieu || "system",
          status: item.status || item.trangThai || "pending",
          createdAt:
            item.createdAt ||
            item.ngayTao ||
            new Date().toISOString().split("T")[0],
          createdBy: item.createdBy || item.nguoiTao || "API",
          description: item.description || item.moTa || "",
          matchRate: item.matchRate || item.tyLeKhop,
        }));

        setReconciliationData(apiData);
        showSuccess(`Tìm thấy ${apiData.length} đợt đối soát`);
      } else {
        setReconciliationData([]);
        showError("Không tìm thấy dữ liệu đối soát");
      }
    } catch (error: any) {
      console.error("Lỗi khi tìm kiếm đối soát:", error);
      showError("Có lỗi xảy ra khi tìm kiếm: " + (error?.message || error));
      setReconciliationData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = reconciliationData.filter((item) => {
    const matchesDate =
      !searchDate ||
      (item.fromDate <= searchDate && item.toDate >= searchDate) ||
      item.createdAt === searchDate;
    return matchesDate;
  });

  const handleCreate = () => {
    if (
      !formData.reconciliationName ||
      !formData.fromDate ||
      !formData.toDate
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const newItem: ReconciliationData = {
      id: Date.now().toString(),
      name: formData.reconciliationName,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      dataSource: formData.dataSource,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: "Người dùng hiện tại",
      description: formData.description,
    };

    setReconciliationData((prev) => [newItem, ...prev]);
    setFormData({
      reconciliationName: "",
      fromDate: "",
      toDate: "",
      description: "",
      dataSource: "system",
    });
    setShowCreateModal(false);
  };

  const handleEdit = (item: ReconciliationData) => {
    setEditingItem(item);
    setFormData({
      reconciliationName: item.name,
      fromDate: item.fromDate,
      toDate: item.toDate,
      description: item.description,
      dataSource: item.dataSource,
    });
    setShowCreateModal(true);
  };

  const handleUpdate = () => {
    if (!editingItem) return;

    setReconciliationData((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? { ...item, ...formData, name: formData.reconciliationName }
          : item
      )
    );

    setEditingItem(null);
    setFormData({
      reconciliationName: "",
      fromDate: "",
      toDate: "",
      description: "",
      dataSource: "system",
    });
    setShowCreateModal(false);
  };

  const handleViewDetail = async (item: ReconciliationData) => {
    try {
      setDetailLoading(true);
      setShowDetailModal(true);

      // Extract ID from item.id (format: "all-0" or actual ID)
      const id = item.id.includes("-") ? item.id.split("-")[1] : item.id;
      const numericId = parseInt(id);

      if (isNaN(numericId)) {
        showError("ID đối soát không hợp lệ");
        return;
      }

      const res = await CrmApiService.getDoiSoatById(numericId);

      if (res.status === 200 && res.data) {
        setDoiSoatDetail(res.data);
        showSuccess("Tải thông tin chi tiết thành công");
      } else {
        showError(
          "Không thể tải thông tin chi tiết: " +
            (res.message || "Lỗi không xác định")
        );
        setShowDetailModal(false);
      }
    } catch (error: any) {
      console.error("Lỗi khi tải chi tiết đối soát:", error);
      showError("Lỗi khi tải thông tin chi tiết: " + (error?.message || error));
      setShowDetailModal(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleRunDoiSoat = async () => {
    try {
      setRunLoading(true);

      // Format date to dd/MM/yyyy if provided
      let formattedDate = "";
      if (runDate) {
        const date = new Date(runDate);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        formattedDate = `${day}/${month}/${year}`;
      }

      const res = await CrmApiService.chayDoiSoatThuCong(
        formattedDate || undefined
      );

      if (res.status === 200 && res.data) {
        const data = res.data;
        if (data.status === "01") {
          showError(data.message || "Không thể chạy đối soát cho ngày này");
        } else {
          showSuccess(data.message || "Chạy đối soát thủ công thành công");
          setShowRunModal(false);
          setRunDate("");
          // Reload danh sách đối soát
          const allRes = await CrmApiService.getAllDoiSoat();
          if (allRes.status === 200 && Array.isArray(allRes.data)) {
            const mapped = allRes.data.map((row: any, idx: number) => ({
              id: String(row.id ?? `all-${idx}`),
              name: row.soBk
                ? `ĐS ${row.soBk}`
                : `Đối soát #${row.lanDs ?? idx + 1}`,
              fromDate:
                row.ngayBk ||
                row.ngayDs ||
                new Date().toISOString().split("T")[0],
              toDate:
                row.ngayDs ||
                row.ngayBk ||
                new Date().toISOString().split("T")[0],
              dataSource: "system",
              status: row.trangThai || "pending",
              createdAt: row.ngayDs || new Date().toISOString().split("T")[0],
              createdBy: "Hệ thống",
              description: `NH: ${row.nhDs ?? "-"} | KB: ${row.kbDs ?? "-"}`,
              matchRate: undefined,
            }));
            setReconciliationData(mapped);
          }
        }
      } else {
        showError(
          "Không thể chạy đối soát: " + (res.message || "Lỗi không xác định")
        );
      }
    } catch (error: any) {
      console.error("Lỗi khi chạy đối soát thủ công:", error);
      showError("Lỗi khi chạy đối soát: " + (error?.message || error));
    } finally {
      setRunLoading(false);
    }
  };

  const handleExportDoiSoat = async () => {
    try {
      setExportLoading(true);

      if (!exportData.tuNgay || !exportData.denNgay) {
        showError("Vui lòng chọn từ ngày và đến ngày");
        return;
      }

      const res = await CrmApiService.exportDoiSoat(
        exportData.tuNgay,
        exportData.denNgay,
        exportData.nganHang || undefined,
        exportData.nhDs || undefined,
        exportData.kbDs || undefined,
        exportData.trangThai || undefined
      );

      if (res instanceof Blob) {
        // Tạo URL để download file
        const url = window.URL.createObjectURL(res);
        const link = document.createElement("a");
        link.href = url;

        // Tạo tên file với timestamp
        const now = new Date();
        const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-");
        link.download = `doi-soat-export-${timestamp}.xlsx`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showSuccess("Xuất dữ liệu đối soát thành công");
        setShowExportModal(false);
        setExportData({
          tuNgay: "",
          denNgay: "",
          nganHang: "",
          nhDs: "",
          kbDs: "",
          trangThai: "",
        });
      } else {
        showError("Lỗi xuất dữ liệu: " + (res.message || "Lỗi không xác định"));
      }
    } catch (error: any) {
      console.error("Lỗi khi xuất dữ liệu đối soát:", error);
      showError("Lỗi khi xuất dữ liệu: " + (error?.message || error));
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportMasterDetail = async () => {
    try {
      setMasterDetailLoading(true);

      if (!masterDetailData.tuNgay || !masterDetailData.denNgay) {
        showError("Vui lòng chọn từ ngày và đến ngày");
        return;
      }

      const res = await CrmApiService.exportDoiSoatMasterDetail(
        masterDetailData.tuNgay,
        masterDetailData.denNgay,
        masterDetailData.nganHang || undefined,
        masterDetailData.nhDs || undefined,
        masterDetailData.kbDs || undefined,
        masterDetailData.trangThai || undefined
      );

      if (res instanceof Blob) {
        // Tạo URL để download file
        const url = window.URL.createObjectURL(res);
        const link = document.createElement("a");
        link.href = url;

        // Tạo tên file với timestamp
        const now = new Date();
        const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-");
        link.download = `doi-soat-master-detail-${timestamp}.xlsx`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showSuccess("Xuất dữ liệu đối soát master-detail thành công");
        setShowMasterDetailModal(false);
        setMasterDetailData({
          tuNgay: "",
          denNgay: "",
          nganHang: "",
          nhDs: "",
          kbDs: "",
          trangThai: "",
        });
      } else {
        showError("Lỗi xuất dữ liệu: " + (res.message || "Lỗi không xác định"));
      }
    } catch (error: any) {
      console.error("Lỗi khi xuất dữ liệu đối soát master-detail:", error);
      showError("Lỗi khi xuất dữ liệu: " + (error?.message || error));
    } finally {
      setMasterDetailLoading(false);
    }
  };

  const handleBankReconcile = async () => {
    try {
      setBankReconcileLoading(true);

      if (
        !bankReconcileData.reconcileDate ||
        !bankReconcileData.bankCode ||
        !bankReconcileData.bankName
      ) {
        showError("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }

      const res = await CrmApiService.processBankReconcile(
        bankReconcileData.reconcileDate,
        bankReconcileData.bankCode,
        bankReconcileData.bankName,
        bankReconcileData.unitCode,
        bankReconcileData.unitName,
        bankReconcileData.totalTransaction,
        bankReconcileData.totalAmount,
        bankReconcileData.transactions
      );

      if (res.status === 200) {
        showSuccess("Đối soát với ngân hàng thành công");
        setShowBankReconcileModal(false);
        setBankReconcileData({
          reconcileDate: "",
          bankCode: "",
          bankName: "",
          unitCode: "",
          unitName: "",
          totalTransaction: 0,
          totalAmount: 0,
          transactions: [],
        });
      } else {
        showError(
          "Lỗi đối soát với ngân hàng: " + (res.message || "Lỗi không xác định")
        );
      }
    } catch (error: any) {
      console.error("Lỗi khi đối soát với ngân hàng:", error);
      showError("Lỗi khi đối soát: " + (error?.message || error));
    } finally {
      setBankReconcileLoading(false);
    }
  };

  const addTransaction = () => {
    setBankReconcileData({
      ...bankReconcileData,
      transactions: [
        ...bankReconcileData.transactions,
        {
          transId: "",
          toKhaiId: "",
          amount: 0,
          status: "",
          payTime: new Date().toISOString(),
          sendToKBNNStatus: "",
          remark: "",
        },
      ],
    });
  };

  const removeTransaction = (index: number) => {
    setBankReconcileData({
      ...bankReconcileData,
      transactions: bankReconcileData.transactions.filter(
        (_, i) => i !== index
      ),
    });
  };

  const updateTransaction = (index: number, field: string, value: any) => {
    const updatedTransactions = [...bankReconcileData.transactions];
    updatedTransactions[index] = {
      ...updatedTransactions[index],
      [field]: value,
    };
    setBankReconcileData({
      ...bankReconcileData,
      transactions: updatedTransactions,
    });
  };

  const handleKbReconcile = async () => {
    try {
      setKbReconcileLoading(true);

      if (!kbReconcileData.reconcileDate) {
        showError("Vui lòng chọn ngày đối soát");
        return;
      }

      const res = await CrmApiService.processKbReconcile(
        kbReconcileData.reconcileDate,
        kbReconcileData.totalTransaction,
        kbReconcileData.totalAmount,
        kbReconcileData.transactions
      );

      if (res.status === 200) {
        showSuccess("Đối soát với kho bạc thành công");
        setShowKbReconcileModal(false);
        setKbReconcileData({
          reconcileDate: "",
          totalTransaction: 0,
          totalAmount: 0,
          transactions: [],
        });
      } else {
        showError(
          "Lỗi đối soát với kho bạc: " + (res.message || "Lỗi không xác định")
        );
      }
    } catch (error: any) {
      console.error("Lỗi khi đối soát với kho bạc:", error);
      showError("Lỗi khi đối soát: " + (error?.message || error));
    } finally {
      setKbReconcileLoading(false);
    }
  };

  const addKbTransaction = () => {
    setKbReconcileData({
      ...kbReconcileData,
      transactions: [
        ...kbReconcileData.transactions,
        {
          transId: "",
          amount: 0,
        },
      ],
    });
  };

  const removeKbTransaction = (index: number) => {
    setKbReconcileData({
      ...kbReconcileData,
      transactions: kbReconcileData.transactions.filter((_, i) => i !== index),
    });
  };

  const updateKbTransaction = (index: number, field: string, value: any) => {
    const updatedTransactions = [...kbReconcileData.transactions];
    updatedTransactions[index] = {
      ...updatedTransactions[index],
      [field]: value,
    };
    setKbReconcileData({
      ...kbReconcileData,
      transactions: updatedTransactions,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đợt đối soát này?")) {
      setReconciliationData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl">
                📊
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Đối Soát Thủ Công
                </h1>
                <p className="text-gray-600">
                  Quản lý các đợt đối soát dữ liệu
                </p>
              </div>
            </div>
            {/* Action Buttons Layout - Responsive Design */}
            <div className="flex flex-col xl:flex-row gap-4">
              {/* Primary Actions Group */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 bg-green-50 rounded-lg p-2">
                  <Button
                    variant="success"
                    icon={<span>➕</span>}
                    onClick={() => setShowCreateModal(true)}
                    className="text-sm px-3 py-2 font-medium"
                  >
                    Tạo đối soát
                  </Button>
                  <Button
                    variant="warning"
                    icon={<span>🚀</span>}
                    onClick={() => setShowRunModal(true)}
                    className="text-sm px-3 py-2 font-medium"
                  >
                    Chạy đối soát
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      setLoading(true);
                      const res = await CrmApiService.getAllDoiSoat();
                      if (res.status === 200 && Array.isArray(res.data)) {
                        const mapped = res.data.map(
                          (row: any, idx: number) => ({
                            id: String(row.id ?? `all-${idx}`),
                            name: row.soBk
                              ? `ĐS ${row.soBk}`
                              : `Đối soát #${row.lanDs ?? idx + 1}`,
                            fromDate:
                              row.ngayBk ||
                              row.ngayDs ||
                              new Date().toISOString().split("T")[0],
                            toDate:
                              row.ngayDs ||
                              row.ngayBk ||
                              new Date().toISOString().split("T")[0],
                            dataSource: "system",
                            status: row.trangThai || "pending",
                            createdAt:
                              row.ngayDs ||
                              new Date().toISOString().split("T")[0],
                            createdBy: "Hệ thống",
                            description: `NH: ${row.nhDs ?? "-"} | KB: ${
                              row.kbDs ?? "-"
                            }`,
                            matchRate: undefined,
                          })
                        );
                        setReconciliationData(mapped);
                        showSuccess(`Tải ${mapped.length} đợt đối soát`);
                      } else {
                        setReconciliationData([]);
                        showError("Không có dữ liệu đối soát");
                      }
                    } catch (e: any) {
                      console.error("Load all doi soat error:", e);
                      showError("Lỗi tải danh sách: " + (e?.message || e));
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="text-sm px-3 py-2 font-medium"
                >
                  Tải tất cả
                </Button>
              </div>

              {/* Export Actions Group */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-2">
                  <Button
                    variant="info"
                    icon={<span>📊</span>}
                    onClick={() => setShowExportModal(true)}
                    className="text-sm px-3 py-2 font-medium"
                  >
                    Xuất Excel
                  </Button>
                  <Button
                    variant="secondary"
                    icon={<span>📋</span>}
                    onClick={() => setShowMasterDetailModal(true)}
                    className="text-sm px-3 py-2 font-medium"
                  >
                    Master-Detail
                  </Button>
                </div>
              </div>

              {/* External Actions Group */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                  <Button
                    variant="primary"
                    icon={<span>🏦</span>}
                    onClick={() => setShowBankReconcileModal(true)}
                    className="text-sm px-3 py-2 font-medium"
                  >
                    Đối soát Ngân Hàng
                  </Button>
                  <Button
                    variant="success"
                    icon={<span>💰</span>}
                    onClick={() => setShowKbReconcileModal(true)}
                    className="text-sm px-3 py-2 font-medium"
                  >
                    Đối soát Kho Bạc
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 animate-fade-in-up">
          <div className="flex justify-end gap-4">
            <div className="w-48">
              <Input
                type="date"
                placeholder="Tìm kiếm theo ngày đối soát..."
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
              />
            </div>
            <div className="w-32">
              <Button
                variant="success"
                onClick={handleSearch}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Đang tìm...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-search"></i>
                    <span>Search</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <Card className="animate-fade-in-up">
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-800">
              Danh Sách Đợt Đối Soát ({filteredData.length})
            </h2>
          </Card.Header>
          <Card.Body className="p-0">
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-inbox text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có dữ liệu đối soát
                </h3>
                <p className="text-gray-500">
                  Chưa có đợt đối soát nào được tạo hoặc không tìm thấy kết quả
                  phù hợp.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Tên đợt
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Thời gian
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Nguồn dữ liệu
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Tỷ lệ khớp
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Người tạo
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-800">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(item.fromDate).toLocaleDateString("vi-VN")}{" "}
                          - {new Date(item.toDate).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {getDataSourceLabel(item.dataSource)}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.matchRate ? `${item.matchRate}%` : "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div>
                            <div>{item.createdBy}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(item.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetail(item)}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                              title="Xem chi tiết đối soát"
                            >
                              Chi tiết
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingItem
                  ? "Chỉnh Sửa Đợt Đối Soát"
                  : "Tạo Mới Đợt Đối Soát"}
              </h2>

              <form className="space-y-4">
                <Input
                  label="Tên đợt đối soát"
                  name="reconciliationName"
                  value={formData.reconciliationName}
                  onChange={handleInputChange}
                  placeholder="Nhập tên đợt đối soát..."
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Từ ngày"
                    name="fromDate"
                    type="date"
                    value={formData.fromDate}
                    onChange={handleInputChange}
                    required
                  />

                  <Input
                    label="Đến ngày"
                    name="toDate"
                    type="date"
                    value={formData.toDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nguồn dữ liệu
                  </label>
                  <select
                    name="dataSource"
                    value={formData.dataSource}
                    onChange={handleInputChange}
                    title="Chọn nguồn dữ liệu"
                    aria-label="Chọn nguồn dữ liệu"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl hover:bg-gray-100 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300 focus:outline-none"
                  >
                    <option value="system">Hệ thống nội bộ</option>
                    <option value="customs">Dữ liệu Hải Quan</option>
                    <option value="bank">Dữ liệu ngân hàng</option>
                    <option value="manual">Nhập thủ công</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl hover:bg-gray-100 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300 focus:outline-none"
                    rows={4}
                    placeholder="Nhập mô tả chi tiết về đợt đối soát..."
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button
                    variant="success"
                    fullWidth
                    onClick={editingItem ? handleUpdate : handleCreate}
                  >
                    {editingItem ? "Cập Nhật" : "Tạo Mới"}
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingItem(null);
                      setFormData({
                        reconciliationName: "",
                        fromDate: "",
                        toDate: "",
                        description: "",
                        dataSource: "system",
                      });
                    }}
                  >
                    Hủy Bỏ
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Chi tiết đối soát
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {detailLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  <span className="ml-3 text-gray-600">Đang tải...</span>
                </div>
              ) : doiSoatDetail ? (
                <div className="space-y-6">
                  {/* Thông tin chung */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Thông tin chung
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          ID:
                        </label>
                        <p className="text-gray-800">{doiSoatDetail.id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Số BK:
                        </label>
                        <p className="text-gray-800">{doiSoatDetail.soBk}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Ngày BK:
                        </label>
                        <p className="text-gray-800">{doiSoatDetail.ngayBk}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Ngày đối soát:
                        </label>
                        <p className="text-gray-800">{doiSoatDetail.ngayDs}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Tổng số:
                        </label>
                        <p className="text-gray-800">{doiSoatDetail.tongSo}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Trạng thái:
                        </label>
                        <p className="text-gray-800">
                          {doiSoatDetail.trangThai}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          NH DS:
                        </label>
                        <p className="text-gray-800">{doiSoatDetail.nhDs}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          KB DS:
                        </label>
                        <p className="text-gray-800">{doiSoatDetail.kbDs}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-600">
                          Tổng tiền:
                        </label>
                        <p className="text-gray-800 font-semibold text-lg">
                          {doiSoatDetail.tongTien}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Chi tiết danh sách */}
                  {doiSoatDetail.chiTietList &&
                    doiSoatDetail.chiTietList.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Chi tiết danh sách ({doiSoatDetail.chiTietList.length}{" "}
                          bản ghi)
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                                  Số tờ khai
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                                  Ngày tờ khai
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                                  Mã DN
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                                  Tên DN
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                                  Ngân hàng
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                                  Tổng tiền phí
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                                  Ghi chú
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {doiSoatDetail.chiTietList.map(
                                (chiTiet, index) => (
                                  <tr
                                    key={chiTiet.id || index}
                                    className="hover:bg-gray-50"
                                  >
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                                      {chiTiet.soToKhai}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                                      {chiTiet.ngayToKhai}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                                      {chiTiet.maDoanhNghiep}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                                      {chiTiet.tenDoanhNghiep}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                                      {chiTiet.nganHang}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800 font-medium">
                                      {chiTiet.tongTienPhi}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                                      {chiTiet.ghiChu}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-exclamation-triangle text-gray-400 text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Không có dữ liệu
                  </h3>
                  <p className="text-gray-500">
                    Không thể tải thông tin chi tiết đối soát.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Run Doi Soat Modal */}
        {showRunModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Chạy đối soát thủ công
                </h2>
                <button
                  onClick={() => setShowRunModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày đối soát (tùy chọn)
                  </label>
                  <Input
                    type="date"
                    value={runDate}
                    onChange={(e) => setRunDate(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                    placeholder="Chọn ngày đối soát (để trống sẽ dùng ngày hiện tại)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Để trống sẽ sử dụng ngày hiện tại. Hệ thống sẽ tự động tìm
                    ngày làm việc gần nhất.
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRunModal(false);
                      setRunDate("");
                    }}
                    disabled={runLoading}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="warning"
                    onClick={handleRunDoiSoat}
                    disabled={runLoading}
                    icon={
                      runLoading ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <span>🚀</span>
                      )
                    }
                  >
                    {runLoading ? "Đang chạy..." : "Chạy đối soát"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Doi Soat Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Xuất dữ liệu đối soát Excel
                </h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Từ ngày <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={exportData.tuNgay}
                      onChange={(e) =>
                        setExportData({ ...exportData, tuNgay: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đến ngày <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={exportData.denNgay}
                      onChange={(e) =>
                        setExportData({
                          ...exportData,
                          denNgay: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngân hàng
                    </label>
                    <Input
                      type="text"
                      value={exportData.nganHang}
                      onChange={(e) =>
                        setExportData({
                          ...exportData,
                          nganHang: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="Nhập tên ngân hàng"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NH DS
                    </label>
                    <Input
                      type="text"
                      value={exportData.nhDs}
                      onChange={(e) =>
                        setExportData({ ...exportData, nhDs: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="Nhập NH DS"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      KB DS
                    </label>
                    <Input
                      type="text"
                      value={exportData.kbDs}
                      onChange={(e) =>
                        setExportData({ ...exportData, kbDs: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="Nhập KB DS"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <Input
                      type="text"
                      value={exportData.trangThai}
                      onChange={(e) =>
                        setExportData({
                          ...exportData,
                          trangThai: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="Nhập trạng thái"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <i className="fas fa-info-circle text-blue-500 text-lg"></i>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Thông tin xuất dữ liệu
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          • File Excel sẽ chứa nhiều sheet (tổng quan và chi
                          tiết)
                        </p>
                        <p>• Các trường tùy chọn có thể để trống</p>
                        <p>
                          • File sẽ được tải xuống tự động sau khi xuất thành
                          công
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowExportModal(false);
                      setExportData({
                        tuNgay: "",
                        denNgay: "",
                        nganHang: "",
                        nhDs: "",
                        kbDs: "",
                        trangThai: "",
                      });
                    }}
                    disabled={exportLoading}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="info"
                    onClick={handleExportDoiSoat}
                    disabled={exportLoading}
                    icon={
                      exportLoading ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <span>📊</span>
                      )
                    }
                  >
                    {exportLoading ? "Đang xuất..." : "Xuất Excel"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Master-Detail Modal */}
        {showMasterDetailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Xuất dữ liệu đối soát Master-Detail
                </h2>
                <button
                  onClick={() => setShowMasterDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Từ ngày <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={masterDetailData.tuNgay}
                      onChange={(e) =>
                        setMasterDetailData({
                          ...masterDetailData,
                          tuNgay: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đến ngày <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={masterDetailData.denNgay}
                      onChange={(e) =>
                        setMasterDetailData({
                          ...masterDetailData,
                          denNgay: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngân hàng
                    </label>
                    <Input
                      type="text"
                      value={masterDetailData.nganHang}
                      onChange={(e) =>
                        setMasterDetailData({
                          ...masterDetailData,
                          nganHang: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                      placeholder="Nhập tên ngân hàng"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NH DS
                    </label>
                    <Input
                      type="text"
                      value={masterDetailData.nhDs}
                      onChange={(e) =>
                        setMasterDetailData({
                          ...masterDetailData,
                          nhDs: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                      placeholder="Nhập NH DS"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      KB DS
                    </label>
                    <Input
                      type="text"
                      value={masterDetailData.kbDs}
                      onChange={(e) =>
                        setMasterDetailData({
                          ...masterDetailData,
                          kbDs: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                      placeholder="Nhập KB DS"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <Input
                      type="text"
                      value={masterDetailData.trangThai}
                      onChange={(e) =>
                        setMasterDetailData({
                          ...masterDetailData,
                          trangThai: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                      placeholder="Nhập trạng thái"
                    />
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <i className="fas fa-info-circle text-purple-500 text-lg"></i>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-purple-800">
                        Thông tin xuất dữ liệu Master-Detail
                      </h3>
                      <div className="mt-2 text-sm text-purple-700">
                        <p>
                          • File Excel sẽ có layout master-detail trong 1 sheet
                        </p>
                        <p>• Các trường tùy chọn có thể để trống</p>
                        <p>
                          • File sẽ được tải xuống tự động sau khi xuất thành
                          công
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMasterDetailModal(false);
                      setMasterDetailData({
                        tuNgay: "",
                        denNgay: "",
                        nganHang: "",
                        nhDs: "",
                        kbDs: "",
                        trangThai: "",
                      });
                    }}
                    disabled={masterDetailLoading}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleExportMasterDetail}
                    disabled={masterDetailLoading}
                    icon={
                      masterDetailLoading ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <span>📋</span>
                      )
                    }
                  >
                    {masterDetailLoading
                      ? "Đang xuất..."
                      : "Xuất Master-Detail"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bank Reconcile Modal */}
        {showBankReconcileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Đối soát với Ngân hàng
                </h2>
                <button
                  onClick={() => setShowBankReconcileModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">
                    Thông tin cơ bản
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày đối soát <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={bankReconcileData.reconcileDate}
                        onChange={(e) =>
                          setBankReconcileData({
                            ...bankReconcileData,
                            reconcileDate: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã ngân hàng <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={bankReconcileData.bankCode}
                        onChange={(e) =>
                          setBankReconcileData({
                            ...bankReconcileData,
                            bankCode: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="Nhập mã ngân hàng"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên ngân hàng <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={bankReconcileData.bankName}
                        onChange={(e) =>
                          setBankReconcileData({
                            ...bankReconcileData,
                            bankName: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="Nhập tên ngân hàng"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã đơn vị
                      </label>
                      <Input
                        type="text"
                        value={bankReconcileData.unitCode}
                        onChange={(e) =>
                          setBankReconcileData({
                            ...bankReconcileData,
                            unitCode: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="Nhập mã đơn vị"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên đơn vị
                      </label>
                      <Input
                        type="text"
                        value={bankReconcileData.unitName}
                        onChange={(e) =>
                          setBankReconcileData({
                            ...bankReconcileData,
                            unitName: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="Nhập tên đơn vị"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tổng số giao dịch
                      </label>
                      <Input
                        type="number"
                        value={bankReconcileData.totalTransaction}
                        onChange={(e) =>
                          setBankReconcileData({
                            ...bankReconcileData,
                            totalTransaction: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="Nhập tổng số giao dịch"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tổng số tiền
                      </label>
                      <Input
                        type="number"
                        value={bankReconcileData.totalAmount}
                        onChange={(e) =>
                          setBankReconcileData({
                            ...bankReconcileData,
                            totalAmount: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="Nhập tổng số tiền"
                      />
                    </div>
                  </div>
                </div>

                {/* Transactions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Danh sách giao dịch (
                      {bankReconcileData.transactions.length})
                    </h3>
                    <Button
                      variant="success"
                      icon={<span>➕</span>}
                      onClick={addTransaction}
                      className="text-sm px-3 py-2"
                    >
                      Thêm giao dịch
                    </Button>
                  </div>

                  {bankReconcileData.transactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <i className="fas fa-inbox text-4xl mb-2"></i>
                      <p>Chưa có giao dịch nào</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {bankReconcileData.transactions.map(
                        (transaction, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-800">
                                Giao dịch #{index + 1}
                              </h4>
                              <Button
                                variant="outline"
                                onClick={() => removeTransaction(index)}
                                className="text-red-600 hover:text-red-800 text-sm px-2 py-1"
                              >
                                Xóa
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Trans ID
                                </label>
                                <Input
                                  type="text"
                                  value={transaction.transId}
                                  onChange={(e) =>
                                    updateTransaction(
                                      index,
                                      "transId",
                                      e.target.value
                                    )
                                  }
                                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                                  placeholder="Nhập Trans ID"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Tờ khai ID
                                </label>
                                <Input
                                  type="text"
                                  value={transaction.toKhaiId}
                                  onChange={(e) =>
                                    updateTransaction(
                                      index,
                                      "toKhaiId",
                                      e.target.value
                                    )
                                  }
                                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                                  placeholder="Nhập Tờ khai ID"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Số tiền
                                </label>
                                <Input
                                  type="number"
                                  value={transaction.amount}
                                  onChange={(e) =>
                                    updateTransaction(
                                      index,
                                      "amount",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                                  placeholder="Nhập số tiền"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Trạng thái
                                </label>
                                <Input
                                  type="text"
                                  value={transaction.status}
                                  onChange={(e) =>
                                    updateTransaction(
                                      index,
                                      "status",
                                      e.target.value
                                    )
                                  }
                                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                                  placeholder="Nhập trạng thái"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Thời gian thanh toán
                                </label>
                                <Input
                                  type="datetime-local"
                                  value={
                                    transaction.payTime
                                      ? new Date(transaction.payTime)
                                          .toISOString()
                                          .slice(0, 16)
                                      : ""
                                  }
                                  onChange={(e) =>
                                    updateTransaction(
                                      index,
                                      "payTime",
                                      new Date(e.target.value).toISOString()
                                    )
                                  }
                                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Trạng thái gửi KBNN
                                </label>
                                <Input
                                  type="text"
                                  value={transaction.sendToKBNNStatus}
                                  onChange={(e) =>
                                    updateTransaction(
                                      index,
                                      "sendToKBNNStatus",
                                      e.target.value
                                    )
                                  }
                                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                                  placeholder="Nhập trạng thái gửi KBNN"
                                />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Ghi chú
                                </label>
                                <Input
                                  type="text"
                                  value={transaction.remark}
                                  onChange={(e) =>
                                    updateTransaction(
                                      index,
                                      "remark",
                                      e.target.value
                                    )
                                  }
                                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                                  placeholder="Nhập ghi chú"
                                />
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowBankReconcileModal(false);
                      setBankReconcileData({
                        reconcileDate: "",
                        bankCode: "",
                        bankName: "",
                        unitCode: "",
                        unitName: "",
                        totalTransaction: 0,
                        totalAmount: 0,
                        transactions: [],
                      });
                    }}
                    disabled={bankReconcileLoading}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleBankReconcile}
                    disabled={bankReconcileLoading}
                    icon={
                      bankReconcileLoading ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <span>🏦</span>
                      )
                    }
                  >
                    {bankReconcileLoading
                      ? "Đang xử lý..."
                      : "Đối soát Ngân hàng"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KB Reconcile Modal */}
        {showKbReconcileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Đối soát với Kho bạc
                </h2>
                <button
                  onClick={() => setShowKbReconcileModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">
                    Thông tin cơ bản
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày đối soát <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={kbReconcileData.reconcileDate}
                        onChange={(e) =>
                          setKbReconcileData({
                            ...kbReconcileData,
                            reconcileDate: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tổng số giao dịch
                      </label>
                      <Input
                        type="number"
                        value={kbReconcileData.totalTransaction}
                        onChange={(e) =>
                          setKbReconcileData({
                            ...kbReconcileData,
                            totalTransaction: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                        placeholder="Nhập tổng số giao dịch"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tổng số tiền
                      </label>
                      <Input
                        type="number"
                        value={kbReconcileData.totalAmount}
                        onChange={(e) =>
                          setKbReconcileData({
                            ...kbReconcileData,
                            totalAmount: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                        placeholder="Nhập tổng số tiền"
                      />
                    </div>
                  </div>
                </div>

                {/* Transactions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Danh sách giao dịch ({kbReconcileData.transactions.length}
                      )
                    </h3>
                    <Button
                      variant="success"
                      icon={<span>➕</span>}
                      onClick={addKbTransaction}
                      className="text-sm px-3 py-2"
                    >
                      Thêm giao dịch
                    </Button>
                  </div>

                  {kbReconcileData.transactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <i className="fas fa-inbox text-4xl mb-2"></i>
                      <p>Chưa có giao dịch nào</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {kbReconcileData.transactions.map(
                        (transaction, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-800">
                                Giao dịch #{index + 1}
                              </h4>
                              <Button
                                variant="outline"
                                onClick={() => removeKbTransaction(index)}
                                className="text-red-600 hover:text-red-800 text-sm px-2 py-1"
                              >
                                Xóa
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Trans ID
                                </label>
                                <Input
                                  type="text"
                                  value={transaction.transId}
                                  onChange={(e) =>
                                    updateKbTransaction(
                                      index,
                                      "transId",
                                      e.target.value
                                    )
                                  }
                                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
                                  placeholder="Nhập Trans ID"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Số tiền
                                </label>
                                <Input
                                  type="number"
                                  value={transaction.amount}
                                  onChange={(e) =>
                                    updateKbTransaction(
                                      index,
                                      "amount",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
                                  placeholder="Nhập số tiền"
                                />
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowKbReconcileModal(false);
                      setKbReconcileData({
                        reconcileDate: "",
                        totalTransaction: 0,
                        totalAmount: 0,
                        transactions: [],
                      });
                    }}
                    disabled={kbReconcileLoading}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleKbReconcile}
                    disabled={kbReconcileLoading}
                    icon={
                      kbReconcileLoading ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <span>💰</span>
                      )
                    }
                  >
                    {kbReconcileLoading ? "Đang xử lý..." : "Đối soát Kho bạc"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InitializePage;
