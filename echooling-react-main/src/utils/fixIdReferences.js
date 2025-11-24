// Script để tự động sửa các tham chiếu _id thành id trong React components
// Chạy script này để sửa tất cả các file còn lại

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/pages/admin/RegistrationTableTabs.js',
  'src/pages/ClassDetails.jsx',
  'src/pages/Admin2/QuizResultPage.jsx',
  'src/pages/Admin2/Course.js',
  'src/pages/Admin2/Blog.js',
];

const fixFile = (filePath) => {
  try {
    const fullPath = path.join(__dirname, '..', '..', filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Thêm import idHelper nếu chưa có
    if (!content.includes('idHelper')) {
      const importMatch = content.match(/import.*from ['"][^'"]*['"];?\s*\n/);
      if (importMatch) {
        const lastImport = importMatch[importMatch.length - 1];
        const insertIndex = content.lastIndexOf(lastImport) + lastImport.length;
        content = content.slice(0, insertIndex) + 
          "import { getId } from '../../utils/idHelper';\n" + 
          content.slice(insertIndex);
      }
    }
    
    // Sửa rowKey="_id" thành rowKey function
    content = content.replace(/rowKey="_id"/g, 'rowKey={(record) => getId(record)}');
    
    // Sửa dataSource map với _id
    content = content.replace(
      /dataSource=\{([^}]+)\.map\(\(([^)]+)\) => \(\{ \.\.\.\2, key: \2\._id \}\)\}/g,
      'dataSource={mapWithKey($1)}'
    );
    
    // Sửa các tham chiếu _id khác
    content = content.replace(/\._id/g, '.id');
    
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Fixed: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
};

// Chạy script
console.log('🔧 Fixing ID references in React components...');
filesToFix.forEach(fixFile);
console.log('✅ All files fixed!');
