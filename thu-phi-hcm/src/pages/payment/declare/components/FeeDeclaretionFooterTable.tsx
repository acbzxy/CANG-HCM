import { useState } from "react";

interface ContainerData {
  id: number;
  stt: number;
  soVanDon: string;
  soHieuContainer: string;
  soSeal: string;
  loaiCont: string;
  tinhChatCont: string;
  ghiChu: string;
  isEditing: boolean;
}

export default function CargoTabs() {
  const [selectedTab, setSelectedTab] = useState("HANG_CONTAINER");
  const [containers, setContainers] = useState<ContainerData[]>([]);
  const [editingContainer, setEditingContainer] = useState<Partial<ContainerData>>({});

  // Dropdown options
  const loaiContOptions = [
    { value: '', label: '-- Chọn --' },
    { value: '20 feet', label: '20 feet' },
    { value: '40 feet', label: '40 feet' },
  ];

  const tinhChatContOptions = [
    { value: '', label: '-- Chọn --' },
    { value: 'FCL', label: 'FCL' },
    { value: 'LCL', label: 'LCL' },
    { value: 'Empty', label: 'Empty' },
  ];

  // Add new container
  const handleAddNew = () => {
    const newContainer: ContainerData = {
      id: Date.now(),
      stt: containers.length + 1,
      soVanDon: '',
      soHieuContainer: '',
      soSeal: '',
      loaiCont: '',
      tinhChatCont: '',
      ghiChu: '',
      isEditing: true
    };
    setContainers(prev => [...prev, newContainer]);
    setEditingContainer(newContainer);
  };

  // Save container
  const handleSave = (containerId: number) => {
    if (!editingContainer.soVanDon || !editingContainer.soHieuContainer) {
      alert('Vui lòng nhập đầy đủ Số vận đơn và Số hiệu Container!');
      return;
    }

    setContainers(prev => 
      prev.map(container => 
        container.id === containerId
          ? { ...container, ...editingContainer, isEditing: false }
          : container
      )
    );
    setEditingContainer({});
  };

  // Edit container
  const handleEdit = (container: ContainerData) => {
    setContainers(prev => 
      prev.map(c => ({ ...c, isEditing: c.id === container.id }))
    );
    setEditingContainer(container);
  };

  // Delete container
  const handleDelete = (containerId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa container này?')) {
      const updatedContainers = containers
        .filter(c => c.id !== containerId)
        .map((container, index) => ({
          ...container,
          stt: index + 1
        }));
      setContainers(updatedContainers);
    }
  };

  // Cancel editing
  const handleCancel = (containerId: number) => {
    const isNewContainer = containers.find(c => c.id === containerId && !c.soVanDon && !c.soHieuContainer);
    
    if (isNewContainer) {
      setContainers(prev => prev.filter(c => c.id !== containerId));
    } else {
      setContainers(prev => 
        prev.map(c => ({ ...c, isEditing: false }))
      );
    }
    setEditingContainer({});
  };

  // Handle input change
  const handleInputChange = (field: keyof ContainerData, value: string) => {
    setEditingContainer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const tabs = [
    { id: "HANG_CONTAINER", label: "Danh sách container" },
    { id: "HANG_ROILONGKIEN", label: "Danh sách hàng rời, lỏng, kiện" },
    { id: "HANG_CONTAINER_CFS", label: "Danh sách container CFS" },
    { id: "TOKHAI_CHUNG_CONT", label: "Danh sách tờ khai liên quan" },
    { id: "DINH_KEM", label: "Đính kèm" },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      {/* Radio group */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="LOAI_TK_NP"
            value="100"
            defaultChecked
            className="appearance-none w-4 h-4 border border-gray-400 rounded-none
                 checked:after:content-['✓'] checked:after:text-green-600 
                 checked:after:flex checked:after:items-center checked:after:justify-center 
                 checked:after:w-full checked:after:h-full bg-white"
          />
          <span>HÀNG CONTAINER</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="LOAI_TK_NP"
            value="101"
            className="appearance-none w-4 h-4 border border-gray-400 rounded-none
                 checked:after:content-['✓'] checked:after:text-green-600 
                 checked:after:flex checked:after:items-center checked:after:justify-center 
                 checked:after:w-full checked:after:h-full bg-white"
          />
          <span>HÀNG RỜI, LỎNG, KIỆN</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="LOAI_TK_NP"
            value="102"
            className="appearance-none w-4 h-4 border border-gray-400 rounded-none
                 checked:after:content-['✓'] checked:after:text-green-600 
                 checked:after:flex checked:after:items-center checked:after:justify-center 
                 checked:after:w-full checked:after:h-full bg-white"
          />
          <span>HÀNG CONTAINER TÍNH TRỌNG LƯỢNG (Không áp dụng cho CFS)</span>
        </label>
      </div>

      {/* Tabs header */}
      <ul className="flex border-b mb-4">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors duration-200 ${
                selectedTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent hover:text-blue-500"
              }`}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Tabs content */}
      <div>
        {selectedTab === "HANG_CONTAINER" && (
          <div>
            <div className="flex gap-2 mb-3">
              <button 
                onClick={handleAddNew}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full flex items-center gap-1 transition-colors"
              >
                <i className="fa fa-plus-circle"></i> Thêm mới
              </button>
              <button className="bg-green-500 text-white px-4 py-1 rounded-full flex items-center gap-1">
                <i className="fa fa-file-excel-o"></i> Import Excel
              </button>
              <a
                href="/Files/FileTmp/DS_CHITIET_CONT.xls"
                className="text-blue-600 italic flex items-center gap-1"
              >
                <i className="fa fa-download"></i> Tải mẫu file import hàng cont
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-12 text-center border p-2">STT</th>
                    <th className="text-center border p-2">Số vận đơn</th>
                    <th className="text-center border p-2">
                      Số hiệu Container
                    </th>
                    <th className="text-center border p-2">Số Seal</th>
                    <th className="text-center border p-2">Loại Cont</th>
                    <th className="text-center border p-2">Tính chất Cont</th>
                    <th className="text-center border p-2">Ghi chú</th>
                    <th className="w-10 border p-2">#</th>
                  </tr>
                </thead>
                <tbody>
                  {containers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center p-4 text-gray-500">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    containers.map((container) => (
                      <tr key={container.id} className="hover:bg-gray-50">
                        <td className="border p-2 text-center">{container.stt}</td>
                        
                        {/* Số vận đơn */}
                        <td className="border p-2">
                          {container.isEditing ? (
                            <input
                              type="text"
                              value={editingContainer.soVanDon || container.soVanDon}
                              onChange={(e) => handleInputChange('soVanDon', e.target.value)}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Nhập số vận đơn"
                            />
                          ) : (
                            <span>{container.soVanDon}</span>
                          )}
                        </td>

                        {/* Số hiệu Container */}
                        <td className="border p-2">
                          {container.isEditing ? (
                            <input
                              type="text"
                              value={editingContainer.soHieuContainer || container.soHieuContainer}
                              onChange={(e) => handleInputChange('soHieuContainer', e.target.value)}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Nhập số hiệu container"
                            />
                          ) : (
                            <span>{container.soHieuContainer}</span>
                          )}
                        </td>

                        {/* Số Seal */}
                        <td className="border p-2">
                          {container.isEditing ? (
                            <input
                              type="text"
                              value={editingContainer.soSeal || container.soSeal}
                              onChange={(e) => handleInputChange('soSeal', e.target.value)}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Nhập số seal"
                            />
                          ) : (
                            <span>{container.soSeal}</span>
                          )}
                        </td>

                        {/* Loại Cont */}
                        <td className="border p-2">
                          {container.isEditing ? (
                            <select
                              value={editingContainer.loaiCont || container.loaiCont}
                              onChange={(e) => handleInputChange('loaiCont', e.target.value)}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {loaiContOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span>{container.loaiCont || '-- Chọn --'}</span>
                          )}
                        </td>

                        {/* Tính chất Cont */}
                        <td className="border p-2">
                          {container.isEditing ? (
                            <select
                              value={editingContainer.tinhChatCont || container.tinhChatCont}
                              onChange={(e) => handleInputChange('tinhChatCont', e.target.value)}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {tinhChatContOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span>{container.tinhChatCont || '-- Chọn --'}</span>
                          )}
                        </td>

                        {/* Ghi chú */}
                        <td className="border p-2">
                          {container.isEditing ? (
                            <input
                              type="text"
                              value={editingContainer.ghiChu || container.ghiChu}
                              onChange={(e) => handleInputChange('ghiChu', e.target.value)}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Nhập ghi chú"
                            />
                          ) : (
                            <span>{container.ghiChu}</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="border p-2 text-center">
                          {container.isEditing ? (
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() => handleSave(container.id)}
                                className="text-green-600 hover:text-green-800 px-1 py-1 rounded"
                                title="Lưu"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => handleCancel(container.id)}
                                className="text-red-600 hover:text-red-800 px-1 py-1 rounded"
                                title="Hủy"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() => handleEdit(container)}
                                className="text-blue-600 hover:text-blue-800 px-1 py-1 rounded"
                                title="Sửa"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDelete(container.id)}
                                className="text-red-600 hover:text-red-800 px-1 py-1 rounded"
                                title="Xóa"
                              >
                                🗑️
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === "HANG_ROILONGKIEN" && (
          <div>
            <a
              href="/Files/FileTmp/DS_CHITIET_ROI.xlsx"
              className="text-blue-600 italic flex items-center gap-1 mb-3"
            >
              <i className="fa fa-download"></i> Tải mẫu file import hàng
              lỏng,rời
            </a>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-12 text-center border p-2">STT</th>
                    <th className="text-center border p-2">Số vận đơn</th>
                    <th className="text-center border p-2">Tổng trọng lượng</th>
                    <th className="text-center border p-2">ĐVT</th>
                    <th className="text-center border p-2">Ghi chú</th>
                    <th className="w-10 border p-2">#</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      Không có dữ liệu
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === "HANG_CONTAINER_CFS" && (
          <div>
            <a
              href="/Files/FileTmp/DS_CHITIET_CONT_CFS.xlsx"
              className="text-blue-600 italic flex items-center gap-1 mb-3"
            >
              <i className="fa fa-download"></i> Tải mẫu file import hàng
              container CFS
            </a>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-12 text-center border p-2">STT</th>
                    <th className="text-center border p-2">
                      Số hiệu container
                    </th>
                    <th className="text-center border p-2">Tổng trọng lượng</th>
                    <th className="text-center border p-2">ĐVT</th>
                    <th className="text-center border p-2">Ghi chú</th>
                    <th className="w-10 border p-2">#</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      Không có dữ liệu
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === "TOKHAI_CHUNG_CONT" && (
          <div>
            <a
              href="/Files/FileTmp/Mau_danh_sach_to_khai_chung_container.xlsx"
              className="text-blue-600 italic flex items-center gap-1 mb-3"
            >
              <i className="fa fa-download"></i> Tải mẫu file import tờ khai
              chung container
            </a>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-12 text-center border p-2">STT</th>
                    <th className="text-center border p-2">Số tờ khai</th>
                    <th className="text-center border p-2">Ngày tờ khai</th>
                    <th className="text-center border p-2">Mã loại hình</th>
                    <th className="text-center border p-2">Mã hải quan</th>
                    <th className="w-10 border p-2">#</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      Không có dữ liệu
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === "DINH_KEM" && (
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-12 text-center border p-2">STT</th>
                    <th className="text-center border p-2">Mô tả loại file</th>
                    <th className="text-center border p-2" colSpan={2}>
                      File đính kèm
                    </th>
                    <th className="w-10 border p-2">#</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} className="text-center p-4">
                      Không có dữ liệu
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
