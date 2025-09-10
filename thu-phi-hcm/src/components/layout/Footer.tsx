import React from 'react'

interface FooterProps {
  sidebarCollapsed?: boolean
}

const Footer: React.FC<FooterProps> = ({ sidebarCollapsed = false }) => {
  return (
    <footer 
      className={`
        bg-gray-800 text-white text-center py-4 
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-72'}
      `}
    >
      <div className="container mx-auto px-4">
        <p className="text-sm">
          <strong>Copyright &copy; 2025</strong> - Demo web thu phí
        </p>
      </div>
    </footer>
  )
}

export default Footer
