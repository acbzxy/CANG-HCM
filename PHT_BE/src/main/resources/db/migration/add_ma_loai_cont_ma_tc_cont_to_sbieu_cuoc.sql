-- Migration script to add MA_LOAI_CONT and MA_TC_CONT columns to SBIEU_CUOC table
-- These columns will store container type codes and container characteristic codes for direct mapping

-- Add the MA_LOAI_CONT column to the SBIEU_CUOC table
ALTER TABLE SBIEU_CUOC 
ADD COLUMN MA_LOAI_CONT VARCHAR(100);

-- Add the MA_TC_CONT column to the SBIEU_CUOC table  
ALTER TABLE SBIEU_CUOC 
ADD COLUMN MA_TC_CONT VARCHAR(100);

-- Add comments to describe the column purposes
COMMENT ON COLUMN SBIEU_CUOC.MA_LOAI_CONT IS 'Mã loại container - Container type code for direct mapping';
COMMENT ON COLUMN SBIEU_CUOC.MA_TC_CONT IS 'Mã tính chất container - Container characteristic code for direct mapping';



