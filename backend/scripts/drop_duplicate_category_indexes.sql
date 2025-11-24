-- Script xóa các index/unique key dư thừa trên cột name của bảng categories (name_2 đến name_63)
DELIMITER $$
CREATE PROCEDURE drop_duplicate_category_indexes()
BEGIN
  DECLARE i INT DEFAULT 2;
  DECLARE idx_name VARCHAR(20);
  WHILE i <= 63 DO
    SET idx_name = CONCAT('name_', i);
    SET @sql = CONCAT('ALTER TABLE categories DROP INDEX ', idx_name, ';');
    -- Kiểm tra index tồn tại trước khi xóa
    IF EXISTS (SELECT 1 FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'categories' AND index_name = idx_name) THEN
      PREPARE stmt FROM @sql;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
    END IF;
    SET i = i + 1;
  END WHILE;
END$$
DELIMITER ;

-- Để chạy:
-- CALL drop_duplicate_category_indexes();
-- Sau đó có thể DROP PROCEDURE drop_duplicate_category_indexes;
