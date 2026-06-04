const useGuestCheck = () => {
    const isGuest = localStorage.getItem('isGuest') === 'true';
    
    const guestAlert = () => {
        if (isGuest) {
            alert('🔒 Demo Mode! This feature is for admin only!');
            return true;
        }
        return false;
    };
    
    return { isGuest, guestAlert };
};

export default useGuestCheck;