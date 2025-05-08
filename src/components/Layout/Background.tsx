import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#040614] to-[#091042] animated-bg"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-blue-500/10 blur-xl"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
              transform: 'translate(-50%, -50%)',
              animation: `float ${Math.random() * 20 + 30}s infinite ease-in-out ${Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      {/* Grid effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMyMTMxNEQiIGZpbGwtb3BhY2l0eT0iMC4wNCIgZD0iTTAgMGg2MHY2MEgweiIvPjxwYXRoIGQ9Ik0zMCAwdjYwTTYwIDMwSDBNMCAwbDYwIDYwTTYwIDBMMCA2MCIgc3Ryb2tlPSIjMjEzMTREIiBzdHJva2Utd2lkdGg9Ii41IiBzdHJva2Utb3BhY2l0eT0iMC4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
      
      {/* Subtle light effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1/3 bg-blue-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-indigo-500/10 rounded-full blur-[100px]"></div>
    </div>
  );
};

export default Background;