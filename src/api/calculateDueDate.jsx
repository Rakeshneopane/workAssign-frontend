export const calcDueDate = (daysToComplete)=>{
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + Number(daysToComplete));
        
         return dueDate.toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    }