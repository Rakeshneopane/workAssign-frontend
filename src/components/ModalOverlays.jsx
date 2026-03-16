export function Modal({children, onClose}){
   
    return (
    <div 
        className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative"
        onClick={(e)=>e.stopPropagation()}
      >
        <button 
            onClick={onClose} 
            className="absolute top-2 right-4 text-2xl"
        >   
            &times;
        </button>
        
        {children}
      </div>
    </div>
  );
}