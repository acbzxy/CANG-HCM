import {
  ArrowLeftCircleIcon,
  CheckCircleIcon,
  ChevronDoubleRightIcon,
  MagnifyingGlassIcon,
  WindowIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState } from "react";
import FeeDeclarationForm from "./FeeDeclarationForm";
import CargoTabs from "./FeeDeclaretionFooterTable";

interface FeeInformationFormModalProps {
  onClose: () => void;
  onSave?: (data: any) => void;
}

export default function FeeInformationFormModal({ onClose, onSave }: FeeInformationFormModalProps) {
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleCancelDeclaration = () => {
    setShowCancelConfirmModal(true);
  };

  const handleConfirmCancel = () => {
    // Handle cancel declaration logic
    console.log('Hủy tờ khai');
    setShowCancelConfirmModal(false);
    onClose();
  };

  const handleSignDeclaration = () => {
    // Handle digital signature logic
    console.log('Ký số tờ khai (khai báo nộp phí)');
    alert('Chức năng ký số tờ khai đang được xử lý...');
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
        alert('Vui lòng nhập đầy đủ thông tin doanh nghiệp!');
        return;
      }
      
      // Gọi callback để thêm vào bảng
      if (onSave) {
        await onSave(data);
      }
      
      alert('Đã lưu thông tin thành công!');
      onClose();
      
    } catch (error: any) {
      console.error('💥 Lỗi lưu dữ liệu:', error);
      alert(`Lỗi: ${error.message}`);
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
          <ul
            id="progressbar"
            className="progressbar flex justify-between relative mb-3"
          >
            <li className="step active">Tạo tờ khai phí</li>
            <li className="step">Ký số (Khai báo nộp phí)</li>
            <li className="step">Lấy thông báo phí</li>
            <li className="step">Thực hiện nộp phí</li>
            <li className="step">
              <span className="flex items-center gap-1 justify-center">
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                <span>Hoàn thành</span>
              </span>
            </li>
          </ul>
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
                className="appearance-none w-4 h-4 border border-gray-400 rounded-none
                 checked:after:content-['✓'] checked:after:text-green-600 
                 checked:after:flex checked:after:items-center checked:after:justify-center 
                 checked:after:w-full checked:after:h-full bg-white"
              />
              <span className="ml-2 uppercase">Lấy thông tin từ Hải quan</span>
            </label>
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
              <span className="font-bold ms-4">|</span>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="feeOption"
                className="appearance-none w-4 h-4 border border-gray-400 rounded-none
                 checked:after:content-['✓'] checked:after:text-green-600 
                 checked:after:flex checked:after:items-center checked:after:justify-center 
                 checked:after:w-full checked:after:h-full bg-white"
              />
              <span className="ml-2 uppercase">
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
