-- Migration script to add IMAGEBL column to ToKhaiThongTin table
-- This column will store base64 encoded image data

-- Add the IMAGEBL column to the ToKhaiThongTin table
ALTER TABLE ToKhaiThongTin 
ADD COLUMN IMAGEBL TEXT;

-- Add comment to describe the column purpose
COMMENT ON COLUMN ToKhaiThongTin.IMAGEBL IS 'Base64 encoded image data for storing image information';


