import { useRef, useEffect } from 'react';

const useCombinedRef = (...refs) => {
    const targetRef = useRef();

    useEffect(() => {
        refs.map((ref,i) => {
            if(!ref) {
                return
            }

            if(typeof ref === 'function'){
                ref(targetRef.current);
            }else{
                ref.current = targetRef.current;
            }
            
        })
    }, [refs])
    return targetRef;
}

export {
    useCombinedRef
};