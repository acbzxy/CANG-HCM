-- Migration script to add MA_LOAI_CONT and MA_TC_CONT columns to STO_KHAI_CT table
-- These columns will store container type codes and container characteristic codes

-- Add the MA_LOAI_CONT column to the STO_KHAI_CT table
ALTER TABLE STO_KHAI_CT 
ADD COLUMN MA_LOAI_CONT VARCHAR(100);

-- Add the MA_TC_CONT column to the STO_KHAI_CT table  
ALTER TABLE STO_KHAI_CT 
ADD COLUMN MA_TC_CONT VARCHAR(100);

-- Add comments to describe the column purposes
COMMENT ON COLUMN STO_KHAI_CT.MA_LOAI_CONT IS 'Mã loại container - Container type code';
COMMENT ON COLUMN STO_KHAI_CT.MA_TC_CONT IS 'Mã tính chất container - Container characteristic code';



