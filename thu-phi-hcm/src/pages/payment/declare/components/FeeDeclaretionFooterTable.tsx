import { useState, useEffect, useCallback } from "react";

interface ContainerData {
  id: number;
  stt: number;
  soVanDon: string;
  soHieu: string; // Updated to match API
  soSeal: string;
  loaiCont: string;
  tinhChatCont: string;
  tongTrongLuong?: number;
  donViTinh?: string;
  ghiChu: string;
  maLoaiCont?: string;
  maTcCont?: string;
  donGia?: number;
  soTien?: number;
  isEditing: boolean;
}

interface RoiLongKienData {
  id: number;
  stt: number;
  soVanDon: string;
  tongTrongLuong?: number;
  donViTinh?: string;
  ghiChu: string;
  isEditing: boolean;
}

interface ContainerCFSData {
  id: number;
  stt: number;
  soHieu: string;
  tongTrongLuong?: number;
  donViTinh?: string;
  ghiChu: string;
  isEditing: boolean;
}

interface TokhaiLienQuanData {
  id: number;
  stt: number;
  soToKhai: string;
  ngayToKhai: string;
  maLoaiHinh: string;
  maHaiQuan: string;
  isEditing: boolean;
}

export default function CargoTabs() {
  const [selectedTab, setSelectedTab] = useState("HANG_CONTAINER");
  const [selectedCargoType, setSelectedCargoType] = useState("100"); // Default to "HÀNG CONTAINER"
  const [containers, setContainers] = useState<ContainerData[]>([]);
  const [editingContainer, setEditingContainer] = useState<Partial<ContainerData>>({});
  
  // State for other tabs
  const [roiLongKien, setRoiLongKien] = useState<RoiLongKienData[]>([]);
  const [editingRoiLongKien, setEditingRoiLongKien] = useState<Partial<RoiLongKienData>>({});
  
  const [containerCFS, setContainerCFS] = useState<ContainerCFSData[]>([]);
  const [editingContainerCFS, setEditingContainerCFS] = useState<Partial<ContainerCFSData>>({});
  
  const [tokhaiLienQuan, setTokhaiLienQuan] = useState<TokhaiLienQuanData[]>([]);
  const [editingTokhaiLienQuan, setEditingTokhaiLienQuan] = useState<Partial<TokhaiLienQuanData>>({});

  // Create stable callback for getting container data
  const handleGetContainerData = useCallback(() => {
    console.log('📦 CargoTabs received request for container data');
    console.log('📦 Current containers state:', containers);
    console.log('📦 Current containers length:', containers.length);
    
    // Dispatch current container data back
    const responseEvent = new CustomEvent('containerDataResponse', {
      detail: {
        containers: containers,
        roiLongKien: roiLongKien,
        containerCFS: containerCFS,
        tokhaiLienQuan: tokhaiLienQuan
      }
    });
    window.dispatchEvent(responseEvent);
    console.log('📦 Dispatched container data response:', {
      containers: containers.length,
      roiLongKien: roiLongKien.length,
      containerCFS: containerCFS.length,
      tokhaiLienQuan: tokhaiLienQuan.length
    });
  }, [containers, roiLongKien, containerCFS, tokhaiLienQuan]);

  // Listen for data population events from form modal
  useEffect(() => {
    const handlePopulateContainers = (event: CustomEvent) => {
      console.log('📦 CargoTabs received container data:', event.detail);
      if (event.detail && event.detail.containers) {
        setContainers(event.detail.containers);
        console.log('📦 Updated containers state with', event.detail.containers.length, 'items');
        
        // Debug: Log combo box values
        event.detail.containers.forEach((container: any, index: number) => {
          console.log(`📦 Container ${index + 1} combo box values:`, {
            id: container.id,
            stt: container.stt,
            soVanDon: container.soVanDon,
            soHieu: container.soHieu,
            loaiCont: container.loaiCont,
            tinhChatCont: container.tinhChatCont,
            maLoaiCont: container.maLoaiCont,
            maTcCont: container.maTcCont,
            isEditing: container.isEditing
          });
        });
        
        // Set editing state for containers from API response
        if (event.detail.containers.length > 0) {
          // Set all containers to editing mode to show combo boxes
          const containersWithEditing = event.detail.containers.map((container: any) => ({
            ...container,
            isEditing: true
          }));
          setContainers(containersWithEditing);
          
          // Set first container as active editing
          const firstContainer = containersWithEditing[0];
          setEditingContainer(firstContainer);
          console.log('📦 Set all containers to editing mode to show combo boxes:', containersWithEditing);
        }
        
        // Switch to container tab and select "HÀNG CONTAINER" if data is populated
        if (event.detail.containers.length > 0) {
          setSelectedTab("HANG_CONTAINER");
          setSelectedCargoType("100"); // Auto-select "HÀNG CONTAINER"
          console.log('📦 Switched to container tab and auto-selected "HÀNG CONTAINER" to show populated data');
        }
      }
    };

    const handlePopulateRoiLongKien = (event: CustomEvent) => {
      console.log('📦 CargoTabs received roi long kien data:', event.detail);
      if (event.detail && event.detail.roiLongKien) {
        setRoiLongKien(event.detail.roiLongKien);
        console.log('📦 Updated roi long kien state with', event.detail.roiLongKien.length, 'items');
        
        if (event.detail.roiLongKien.length > 0) {
          setSelectedTab("HANG_ROILONGKIEN");
          console.log('📦 Switched to roi long kien tab to show populated data');
        }
      }
    };

    const handlePopulateContainerCFS = (event: CustomEvent) => {
      console.log('📦 CargoTabs received container CFS data:', event.detail);
      if (event.detail && event.detail.containerCFS) {
        setContainerCFS(event.detail.containerCFS);
        console.log('📦 Updated container CFS state with', event.detail.containerCFS.length, 'items');
        
        if (event.detail.containerCFS.length > 0) {
          setSelectedTab("HANG_CONTAINER_CFS");
          console.log('📦 Switched to container CFS tab to show populated data');
        }
      }
    };

    const handlePopulateTokhaiLienQuan = (event: CustomEvent) => {
      console.log('📦 CargoTabs received tokhai lien quan data:', event.detail);
      if (event.detail && event.detail.tokhaiLienQuan) {
        setTokhaiLienQuan(event.detail.tokhaiLienQuan);
        console.log('📦 Updated tokhai lien quan state with', event.detail.tokhaiLienQuan.length, 'items');
        
        if (event.detail.tokhaiLienQuan.length > 0) {
          setSelectedTab("TOKHAI_CHUNG_CONT");
          console.log('📦 Switched to tokhai lien quan tab to show populated data');
        }
      }
    };


    window.addEventListener('populateContainers', handlePopulateContainers as EventListener);
    window.addEventListener('populateRoiLongKien', handlePopulateRoiLongKien as EventListener);
    window.addEventListener('populateContainerCFS', handlePopulateContainerCFS as EventListener);
    window.addEventListener('populateTokhaiLienQuan', handlePopulateTokhaiLienQuan as EventListener);
    window.addEventListener('getContainerData', handleGetContainerData as EventListener);
    
    return () => {
      window.removeEventListener('populateContainers', handlePopulateContainers as EventListener);
      window.removeEventListener('populateRoiLongKien', handlePopulateRoiLongKien as EventListener);
      window.removeEventListener('populateContainerCFS', handlePopulateContainerCFS as EventListener);
      window.removeEventListener('populateTokhaiLienQuan', handlePopulateTokhaiLienQuan as EventListener);
      window.removeEventListener('getContainerData', handleGetContainerData as EventListener);
    };
  }, [handleGetContainerData]);

  // Dropdown options
  const loaiContOptions = [
    { value: '', label: '-- Chọn --' },
    { value: '20', label: '20 feet' },
    { value: '40', label: '40 feet' },
    { value: '40HC', label: '40HC' },
    { value: '45', label: '45 feet' },
  ];

  const tinhChatContOptions = [
    { value: '', label: '-- Chọn --' },
    { value: 'KHO', label: 'Hàng khô' },
    { value: 'LANH', label: 'Hàng lạnh' },
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
      soHieu: '', // Fixed: was soHieuContainer
      soSeal: '',
      loaiCont: '',
      tinhChatCont: '',
      ghiChu: '',
      isEditing: true
    };
    setContainers(prev => [...prev, newContainer]);
    setEditingContainer(newContainer);
    console.log('➕ Added new container with editing mode:', newContainer);
  };

  // Save container
  const handleSave = (containerId: number) => {
    if (!editingContainer.soVanDon || !editingContainer.soHieu) {
      alert('Vui lòng nhập đầy đủ Số vận đơn và Số hiệu Container!');
      return;
    }

    if (!editingContainer.loaiCont) {
      alert('Vui lòng chọn Loại Container!');
      return;
    }

    if (!editingContainer.tinhChatCont) {
      alert('Vui lòng chọn Tính chất Container!');
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
    const isNewContainer = containers.find(c => c.id === containerId && !c.soVanDon && !c.soHieu);
    
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
    console.log('🔄 handleInputChange called:', { field, value });
    setEditingContainer(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Also update the container in the containers array
    setContainers(prev => 
      prev.map(container => 
        container.id === editingContainer.id
          ? { ...container, [field]: value }
          : container
      )
    );
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
            checked={selectedCargoType === "100"}
            onChange={(e) => setSelectedCargoType(e.target.value)}
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
            checked={selectedCargoType === "101"}
            onChange={(e) => setSelectedCargoType(e.target.value)}
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
            checked={selectedCargoType === "102"}
            onChange={(e) => setSelectedCargoType(e.target.value)}
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
              <button 
                onClick={() => {
                  console.log('🧪 Testing combo box display...');
                  const testContainer: ContainerData = {
                    id: Date.now(),
                    stt: containers.length + 1,
                    soVanDon: 'TEST123',
                    soHieu: 'CONT001',
                    soSeal: 'SEAL001',
                    loaiCont: '40HC',
                    tinhChatCont: 'KHO',
                    ghiChu: 'Test container',
                    isEditing: false
                  };
                  setContainers(prev => [...prev, testContainer]);
                  console.log('📦 Added test container with combo box values:', testContainer);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-full flex items-center gap-1 transition-colors"
              >
                <i className="fa fa-flask"></i> Test Combo
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
                              value={editingContainer.soHieu || container.soHieu}
                              onChange={(e) => handleInputChange('soHieu', e.target.value)}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Nhập số hiệu container"
                            />
                          ) : (
                            <span>{container.soHieu}</span>
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
                          <select
                            value={container.loaiCont || ''}
                            onChange={(e) => {
                              console.log('🔄 Loại Cont changed:', e.target.value);
                              console.log('🔄 Container ID:', container.id);
                              console.log('🔄 Container data:', container);
                              handleInputChange('loaiCont', e.target.value);
                            }}
                            className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            required
                            style={{ minHeight: '32px' }}
                          >
                            {loaiContOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Tính chất Cont */}
                        <td className="border p-2">
                          <select
                            value={container.tinhChatCont || ''}
                            onChange={(e) => {
                              console.log('🔄 Tính chất Cont changed:', e.target.value);
                              console.log('🔄 Container ID:', container.id);
                              console.log('🔄 Container data:', container);
                              handleInputChange('tinhChatCont', e.target.value);
                            }}
                            className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            required
                            style={{ minHeight: '32px' }}
                          >
                            {tinhChatContOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
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
            <div className="flex gap-2 mb-3">
              <button 
                onClick={() => {
                  const newItem: RoiLongKienData = {
                    id: Date.now(),
                    stt: roiLongKien.length + 1,
                    soVanDon: '',
                    tongTrongLuong: 0,
                    donViTinh: '',
                    ghiChu: '',
                    isEditing: true
                  };
                  setRoiLongKien(prev => [...prev, newItem]);
                  setEditingRoiLongKien(newItem);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full flex items-center gap-1 transition-colors"
              >
                <i className="fa fa-plus-circle"></i> Thêm mới
              </button>
              <button className="bg-green-500 text-white px-4 py-1 rounded-full flex items-center gap-1">
                <i className="fa fa-file-excel-o"></i> Import Excel
              </button>
              <a
                href="/Files/FileTmp/DS_CHITIET_ROI.xlsx"
                className="text-blue-600 italic flex items-center gap-1"
              >
                <i className="fa fa-download"></i> Tải mẫu file import hàng lỏng,rời
              </a>
            </div>
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
                  {roiLongKien.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-4 text-gray-500">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    roiLongKien.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="border p-2 text-center">{item.stt}</td>
                        <td className="border p-2">
                          {item.isEditing ? (
                            <input
                              type="text"
                              value={editingRoiLongKien.soVanDon || item.soVanDon}
                              onChange={(e) => setEditingRoiLongKien(prev => ({...prev, soVanDon: e.target.value}))}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Nhập số vận đơn"
                            />
                          ) : (
                            <span>{item.soVanDon}</span>
                          )}
                        </td>
                        <td className="border p-2">
                          {item.isEditing ? (
                            <input
                              type="number"
                              value={editingRoiLongKien.tongTrongLuong || item.tongTrongLuong || ''}
                              onChange={(e) => setEditingRoiLongKien(prev => ({...prev, tongTrongLuong: parseFloat(e.target.value) || 0}))}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Nhập trọng lượng"
                            />
                          ) : (
                            <span>{item.tongTrongLuong?.toLocaleString() || ''}</span>
                          )}
                        </td>
                        <td className="border p-2">
                          {item.isEditing ? (
                            <input
                              type="text"
                              value={editingRoiLongKien.donViTinh || item.donViTinh || ''}
                              onChange={(e) => setEditingRoiLongKien(prev => ({...prev, donViTinh: e.target.value}))}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="VD: KG, TON"
                            />
                          ) : (
                            <span>{item.donViTinh || ''}</span>
                          )}
                        </td>
                        <td className="border p-2">
                          {item.isEditing ? (
                            <input
                              type="text"
                              value={editingRoiLongKien.ghiChu || item.ghiChu}
                              onChange={(e) => setEditingRoiLongKien(prev => ({...prev, ghiChu: e.target.value}))}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Nhập ghi chú"
                            />
                          ) : (
                            <span>{item.ghiChu}</span>
                          )}
                        </td>
                        <td className="border p-2 text-center">
                          {item.isEditing ? (
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() => {
                                  setRoiLongKien(prev => prev.map(c => c.id === item.id ? {...c, ...editingRoiLongKien, isEditing: false} : c));
                                  setEditingRoiLongKien({});
                                }}
                                className="text-green-600 hover:text-green-800 px-1 py-1 rounded"
                                title="Lưu"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => {
                                  setRoiLongKien(prev => prev.map(c => c.id === item.id ? {...c, isEditing: false} : c));
                                  setEditingRoiLongKien({});
                                }}
                                className="text-red-600 hover:text-red-800 px-1 py-1 rounded"
                                title="Hủy"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() => {
                                  setEditingRoiLongKien(item);
                                  setRoiLongKien(prev => prev.map(c => c.id === item.id ? {...c, isEditing: true} : c));
                                }}
                                className="text-blue-600 hover:text-blue-800 px-1 py-1 rounded"
                                title="Sửa"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => setRoiLongKien(prev => prev.filter(c => c.id !== item.id))}
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

        {selectedTab === "HANG_CONTAINER_CFS" && (
          <div>
            <div className="flex gap-2 mb-3">
              <button 
                onClick={() => {
                  const newItem: ContainerCFSData = {
                    id: Date.now(),
                    stt: containerCFS.length + 1,
                    soHieu: '',
                    tongTrongLuong: 0,
                    donViTinh: '',
                    ghiChu: '',
                    isEditing: true
                  };
                  setContainerCFS(prev => [...prev, newItem]);
                  setEditingContainerCFS(newItem);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full flex items-center gap-1 transition-colors"
              >
                <i className="fa fa-plus-circle"></i> Thêm mới
              </button>
              <button className="bg-green-500 text-white px-4 py-1 rounded-full flex items-center gap-1">
                <i className="fa fa-file-excel-o"></i> Import Excel
              </button>
              <a
                href="/Files/FileTmp/DS_CHITIET_CONT_CFS.xlsx"
                className="text-blue-600 italic flex items-center gap-1"
              >
                <i className="fa fa-download"></i> Tải mẫu file import hàng container CFS
              </a>
            </div>
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
                  {containerCFS.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-4 text-gray-500">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    containerCFS.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="border p-2 text-center">{item.stt}</td>
                        <td className="border p-2">
                          {item.isEditing ? (
                            <input
                              type="text"
                              value={editingContainerCFS.soHieu || item.soHieu}
                              onChange={(e) => setEditingContainerCFS(prev => ({...prev, soHieu: e.target.value}))}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Nhập số hiệu container"
                            />
                          ) : (
                            <span>{item.soHieu}</span>
                          )}
                        </td>
                        <td className="border p-2">
                          {item.isEditing ? (
                            <input
                              type="number"
                              value={editingContainerCFS.tongTrongLuong || item.tongTrongLuong || ''}
                              onChange={(e) => setEditingContainerCFS(prev => ({...prev, tongTrongLuong: parseFloat(e.target.value) || 0}))}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Nhập trọng lượng"
                            />
                          ) : (
                            <span>{item.tongTrongLuong?.toLocaleString() || ''}</span>
                          )}
                        </td>
                        <td className="border p-2">
                          {item.isEditing ? (
                            <input
                              type="text"
                              value={editingContainerCFS.donViTinh || item.donViTinh || ''}
                              onChange={(e) => setEditingContainerCFS(prev => ({...prev, donViTinh: e.target.value}))}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="VD: KG, TON"
                            />
                          ) : (
                            <span>{item.donViTinh || ''}</span>
                          )}
                        </td>
                        <td className="border p-2">
                          {item.isEditing ? (
                            <input
                              type="text"
                              value={editingContainerCFS.ghiChu || item.ghiChu}
                              onChange={(e) => setEditingContainerCFS(prev => ({...prev, ghiChu: e.target.value}))}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Nhập ghi chú"
                            />
                          ) : (
                            <span>{item.ghiChu}</span>
                          )}
                        </td>
                        <td className="border p-2 text-center">
                          {item.isEditing ? (
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() => {
                                  setContainerCFS(prev => prev.map(c => c.id === item.id ? {...c, ...editingContainerCFS, isEditing: false} : c));
                                  setEditingContainerCFS({});
                                }}
                                className="text-green-600 hover:text-green-800 px-1 py-1 rounded"
                                title="Lưu"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => {
                                  setContainerCFS(prev => prev.map(c => c.id === item.id ? {...c, isEditing: false} : c));
                                  setEditingContainerCFS({});
                                }}
                                className="text-red-600 hover:text-red-800 px-1 py-1 rounded"
                                title="Hủy"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() => {
                                  setEditingContainerCFS(item);
                                  setContainerCFS(prev => prev.map(c => c.id === item.id ? {...c, isEditing: true} : c));
                                }}
                                className="text-blue-600 hover:text-blue-800 px-1 py-1 rounded"
                                title="Sửa"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => setContainerCFS(prev => prev.filter(c => c.id !== item.id))}
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

        {selectedTab === "TOKHAI_CHUNG_CONT" && (
          <div>
            <div className="flex gap-2 mb-3">
              <button 
                onClick={() => {
                  const newItem: TokhaiLienQuanData = {
                    id: Date.now(),
                    stt: tokhaiLienQuan.length + 1,
                    soToKhai: '',
                    ngayToKhai: '',
                    maLoaiHinh: '',
                    maHaiQuan: '',
                    isEditing: true
                  };
                  setTokhaiLienQuan(prev => [...prev, newItem]);
                  setEditingTokhaiLienQuan(newItem);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full flex items-center gap-1 transition-colors"
              >
                <i className="fa fa-plus-circle"></i> Thêm mới
              </button>
              <button className="bg-green-500 text-white px-4 py-1 rounded-full flex items-center gap-1">
                <i className="fa fa-file-excel-o"></i> Import Excel
              </button>
              <a
                href="/Files/FileTmp/Mau_danh_sach_to_khai_chung_container.xlsx"
                className="text-blue-600 italic flex items-center gap-1"
              >
                <i className="fa fa-download"></i> Tải mẫu file import tờ khai chung container
              </a>
            </div>
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
                  {tokhaiLienQuan.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-4 text-gray-500">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    tokhaiLienQuan.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="border p-2 text-center">{item.stt}</td>
                        <td className="border p-2">
                          {item.isEditing ? (
                            <input
                              type="text"
                              value={editingTokhaiLienQuan.soToKhai || item.soToKhai}
                              onChange={(e) => setEditingTokhaiLienQuan(prev => ({...prev, soToKhai: e.target.value}))}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Nhập số tờ khai"
                            />
                          ) : (
                            <span>{item.soToKhai}</span>
                          )}
                        </td>
                        <td className="border p-2">
                          {item.isEditing ? (
                            <input
                              type="date"
                              value={editingTokhaiLienQuan.ngayToKhai || item.ngayToKhai}
                              onChange={(e) => setEditingTokhaiLienQuan(prev => ({...prev, ngayToKhai: e.target.value}))}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <span>{item.ngayToKhai}</span>
                          )}
                        </td>
                        <td className="border p-2">
                          {item.isEditing ? (
                            <input
                              type="text"
                              value={editingTokhaiLienQuan.maLoaiHinh || item.maLoaiHinh}
                              onChange={(e) => setEditingTokhaiLienQuan(prev => ({...prev, maLoaiHinh: e.target.value}))}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Nhập mã loại hình"
                            />
                          ) : (
                            <span>{item.maLoaiHinh}</span>
                          )}
                        </td>
                        <td className="border p-2">
                          {item.isEditing ? (
                            <input
                              type="text"
                              value={editingTokhaiLienQuan.maHaiQuan || item.maHaiQuan}
                              onChange={(e) => setEditingTokhaiLienQuan(prev => ({...prev, maHaiQuan: e.target.value}))}
                              className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Nhập mã hải quan"
                            />
                          ) : (
                            <span>{item.maHaiQuan}</span>
                          )}
                        </td>
                        <td className="border p-2 text-center">
                          {item.isEditing ? (
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() => {
                                  setTokhaiLienQuan(prev => prev.map(c => c.id === item.id ? {...c, ...editingTokhaiLienQuan, isEditing: false} : c));
                                  setEditingTokhaiLienQuan({});
                                }}
                                className="text-green-600 hover:text-green-800 px-1 py-1 rounded"
                                title="Lưu"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => {
                                  setTokhaiLienQuan(prev => prev.map(c => c.id === item.id ? {...c, isEditing: false} : c));
                                  setEditingTokhaiLienQuan({});
                                }}
                                className="text-red-600 hover:text-red-800 px-1 py-1 rounded"
                                title="Hủy"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() => {
                                  setEditingTokhaiLienQuan(item);
                                  setTokhaiLienQuan(prev => prev.map(c => c.id === item.id ? {...c, isEditing: true} : c));
                                }}
                                className="text-blue-600 hover:text-blue-800 px-1 py-1 rounded"
                                title="Sửa"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => setTokhaiLienQuan(prev => prev.filter(c => c.id !== item.id))}
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
