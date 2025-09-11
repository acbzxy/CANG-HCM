-- Migration script to add IMAGEBL column to STO_KHAI table
-- This column will store base64 encoded image data

-- Add the IMAGEBL column to the STO_KHAI table
ALTER TABLE STO_KHAI 
ADD COLUMN IMAGEBL TEXT;

-- Add comment to describe the column purpose
COMMENT ON COLUMN STO_KHAI.IMAGEBL IS 'Base64 encoded image data for storing image information';


