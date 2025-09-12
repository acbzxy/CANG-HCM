import {
  ArrowLeftCircleIcon,
  ChevronDoubleRightIcon,
  MagnifyingGlassIcon,
  WindowIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState } from "react";
import FeeDeclarationForm from "./FeeDeclarationForm";
import CargoTabs from "./FeeDeclaretionFooterTable";
import { useNotification } from "../../../../context/NotificationContext";

interface FeeInformationFormModalProps {
  onClose: () => void;
  onSave?: (data: any) => void;
}

export default function FeeInformationFormModal({ onClose, onSave }: FeeInformationFormModalProps) {
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isManualDeclaration, setIsManualDeclaration] = useState(false);
  const { showSuccess, showError, showInfo } = useNotification();
  
  const handleCancelDeclaration = () => {
    setShowCancelConfirmModal(true);
  };

  const handleConfirmCancel = () => {
    // Handle cancel declaration logic
    console.log('Hủy tờ khai');
    setShowCancelConfirmModal(false);
    onClose();
  };

  const handleSignDeclaration = async () => {
    try {
      // Handle digital signature logic
      console.log('🔐 Bắt đầu ký số tờ khai (khai báo nộp phí)');
      
      // Simulate digital signature process
      console.log('⏳ Simulating signature process...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success popup only
      console.log('✅ Calling showSuccess notification...');
      showSuccess('Ký số tờ khai thành công!', 'Thành công');
      console.log('🎉 Digital signature completed successfully');
    } catch (error) {
      console.error('❌ Error during digital signature:', error);
      showError('Có lỗi xảy ra khi ký số tờ khai', 'Lỗi');
    }
  };

  const handleFeeOptionChange = (option: 'customs' | 'manual') => {
    setIsManualDeclaration(option === 'manual');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log('💾 Lưu thông tin tờ khai...');
      
      // Thu thập dữ liệu từ form elements
      const formElement = document.querySelector('#feeDeclarationForm') as HTMLFormElement;
      if (!formElement) {
        throw new Error('Không tìm thấy form');
      }
      
      const data = {
        // Thông tin doanh nghiệp khai phí
        companyTaxCode: (formElement.querySelector('input[name="companyTaxCode"]') as HTMLInputElement)?.value || '',
        companyName: (formElement.querySelector('input[name="companyName"]') as HTMLInputElement)?.value || '',
        companyAddress: (formElement.querySelector('input[name="companyAddress"]') as HTMLInputElement)?.value || '',
        
        // Thông tin doanh nghiệp XNK
        importExportCompanyTaxCode: (formElement.querySelector('input[name="importExportCompanyTaxCode"]') as HTMLInputElement)?.value || '',
        importExportCompanyName: (formElement.querySelector('input[name="importExportCompanyName"]') as HTMLInputElement)?.value || '',
        importExportCompanyAddress: (formElement.querySelector('input[name="importExportCompanyAddress"]') as HTMLInputElement)?.value || '',
        
        // Thông tin tờ khai hải quan
        customsDeclarationNumber: (formElement.querySelector('input[name="customsDeclarationNumber"]') as HTMLInputElement)?.value || '',
        customsDeclarationDate: (formElement.querySelector('input[name="customsDeclarationDate"]') as HTMLInputElement)?.value || '',
        
        // Thông tin tờ khai phí
        feeDeclarationReceiptNumber: (formElement.querySelector('input[name="feeDeclarationReceiptNumber"]') as HTMLInputElement)?.value || '',
        feeDeclarationDate: (formElement.querySelector('input[name="feeDeclarationDate"]') as HTMLInputElement)?.value || '',
        notes: (formElement.querySelector('textarea[name="notes"]') as HTMLTextAreaElement)?.value || '',
        
        // Metadata
        id: Date.now(),
        status: 'Thêm mới', // Trạng thái theo yêu cầu
        createdAt: new Date().toISOString()
      };
      
      console.log('📤 Dữ liệu thu thập được:', data);
      
      // Validation cơ bản
      if (!data.companyTaxCode || !data.companyName) {
        showError('Vui lòng nhập đầy đủ thông tin doanh nghiệp!', 'Thông tin thiếu');
        return;
      }
      
      // Gọi callback để thêm vào bảng
      if (onSave) {
        await onSave(data);
      }
      
      console.log('✅ Đã lưu thông tin thành công!');
      onClose();
      
    } catch (error: any) {
      console.error('💥 Lỗi lưu dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      className="w-full flex flex-col bg-white"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.3 }}
    >
      {/* Header */}
      <div className="modal-header fixed top-[85px] w-[calc(100%-45px)] z-20 bg-white">
        <h4 className="modal-title">
          <button
            onClick={onClose}
            className="btn btn-default text-blue-500 me-4 rounded"
          >
            <ArrowLeftCircleIcon className="w-4 h-4" />
            Quay lại
          </button>
          <span className="font-semibold">Thông Tin Tờ Khai Phí</span>
        </h4>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCancelDeclaration}
            className="btn btn-default bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <i className="fas fa-times w-4 h-4 me-1"></i>
            Hủy tờ khai
          </button>
          <button 
            onClick={handleSignDeclaration}
            className="btn btn-default bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <i className="fas fa-signature w-4 h-4 me-1"></i>
            Ký số tờ khai (khai báo nộp phí)
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="btn btn-default bg-blue-800 text-white rounded hover:bg-blue-900 transition-colors disabled:bg-gray-400"
          >
            <WindowIcon className="w-4 h-4 me-1" />
            {loading ? 'Đang lưu...' : 'Lưu lại'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="modal-body mt-[40px] pr-[15px] pb-[100px] pl-[15px] bg-[#E8EBEF] min-h-[278px]">
        <div className="w-full">
          {/* Arrow Step Indicator */}
          <div className="flex items-center w-full mb-6 mt-[22px] rounded-full overflow-hidden">
            <div 
              className="relative h-10 flex items-center text-white font-bold text-sm px-4 shadow-lg flex-1" 
              style={{ 
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)',
                marginRight: '3px',
                zIndex: 5
              }}
            >
              <div className="flex items-center space-x-2 justify-center w-full">
                 <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-black">
                   1
                 </div>
                <span className="text-sm font-medium">Tạo Tờ Khai Phí</span>
              </div>
            </div>
            <div 
              className="relative h-10 flex items-center bg-gray-400 text-white font-bold text-sm px-4 flex-1"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)',
                marginLeft: '-20px',
                marginRight: '3px',
                zIndex: 4
              }}
            >
              <div className="flex items-center space-x-2 justify-center w-full">
                <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <span className="text-sm font-medium">Ký Số Tờ Khai Báo Nộp Phí</span>
              </div>
            </div>
            <div 
              className="relative h-10 flex items-center bg-gray-400 text-white font-bold text-sm px-4 flex-1"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)',
                marginLeft: '-20px',
                marginRight: '3px',
                zIndex: 3
              }}
            >
              <div className="flex items-center space-x-2 justify-center w-full">
                <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <span className="text-sm font-medium">Lấy Thông Báo Phí</span>
              </div>
            </div>
            <div 
              className="relative h-10 flex items-center bg-gray-400 text-white font-bold text-sm px-4 flex-1"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)',
                marginLeft: '-20px',
                marginRight: '3px',
                zIndex: 2
              }}
            >
              <div className="flex items-center space-x-2 justify-center w-full">
                <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <span className="text-sm font-medium">Thực Hiện Nộp Phí</span>
              </div>
            </div>
            <div 
              className="relative h-10 flex items-center bg-gray-400 text-white font-bold text-sm px-4 flex-1 rounded-r-full"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 20px 50%)',
                marginLeft: '-20px',
                zIndex: 1
              }}
            >
              <div className="flex items-center space-x-2 justify-center w-full">
                <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-xs font-bold">
                  5
                </div>
                <span className="text-sm font-medium">Hoàn Thành</span>
              </div>
            </div>
          </div>
        </div>

        <div className="data-master">
          <div className="font-bold uppercase mb-1">
            Nguồn thông tin tờ khai
          </div>
          <div className="item-frame flex items-center">
            <label className="flex items-center mr-6 cursor-pointer">
              <input
                type="radio"
                name="feeOption"
                defaultChecked
                onChange={() => handleFeeOptionChange('customs')}
                className="appearance-none w-4 h-4 border border-gray-400 rounded-full
                 checked:after:content-['✓'] checked:after:text-green-600 
                 checked:after:flex checked:after:items-center checked:after:justify-center 
                 checked:after:w-full checked:after:h-full bg-white"
              />
              <span className="ml-2 uppercase font-bold">Lấy thông tin từ Hải quan</span>
            </label>
            {!isManualDeclaration && (
              <div className="flex items-center mx-2">
                <ChevronDoubleRightIcon className="w-3  h-3" />
                <input
                  type="text"
                  className="border h-[33px] w-[120px] me-1"
                  defaultValue={"0109844160"}
                />
                <input
                  type="text"
                  className="border h-[33px] w-[100px] me-1"
                  placeholder="Số tờ khai HQ"
                />
                <button className="btn btn-primary w-[130px] font-normal bg-[#deecf9] text-[#005a9e] rounded pt-[4px] hover:text-white">
                  <MagnifyingGlassIcon className="w-3  h-3" />
                  &nbsp;Lấy thông tin
                </button>
                <span className="font-bold ms-4"> </span>
              </div>
            )}
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="feeOption"
                onChange={() => handleFeeOptionChange('manual')}
                className="appearance-none w-4 h-4 border border-gray-400 rounded-full
                 checked:after:content-['✓'] checked:after:text-green-600 
                 checked:after:flex checked:after:items-center checked:after:justify-center 
                 checked:after:w-full checked:after:h-full bg-white"
              />
              <span className="ml-2 uppercase font-bold">
                Khai báo tờ khai phí thủ công
              </span>
            </label>
          </div>
          <FeeDeclarationForm />
          <CargoTabs />
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            width: '500px',
            maxWidth: '90vw',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            border: '2px solid #2563eb'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
              padding: '12px 20px',
              color: 'white',
              borderRadius: '6px 6px 0 0'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <i className="fas fa-exclamation-triangle"></i>
                THÔNG BÁO
              </h3>
            </div>

            {/* Modal Content */}
            <div style={{ 
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.6',
                marginBottom: '24px'
              }}>
                Bạn có chắc chắn muốn hủy tờ khai phí có số tờ khai hải quan 23243454354 không?
                <br />
                <span style={{ fontWeight: '600', color: '#dc2626' }}>
                  Lưu ý: cần xác nhận ký số điện tử để hủy tờ khai
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                gap: '12px'
              }}>
                <button
                  onClick={handleConfirmCancel}
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#b91c1c';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }}
                >
                  <i className="fas fa-times"></i>
                  Hủy tờ khai
                </button>

                <button
                  onClick={() => setShowCancelConfirmModal(false)}
                  style={{
                    backgroundColor: '#6b7280',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#4b5563';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#6b7280';
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
