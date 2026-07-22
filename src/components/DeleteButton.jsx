import { useFetcher } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";

export function DeleteButton({ id, action }) {
    const fetcher = useFetcher({ key: `delete-${id}` });
    const [isArtificiallyLoading, setIsArtificiallyLoading] = useState(false);
    const hasToasted = useRef(false);

    // 1. Monitor the Fetcher State
    useEffect(() => {
        let timer;

        const isSubmitting = fetcher.state === "submitting" && 
                            fetcher.formData?.get("intent") === "delete";

        if (isSubmitting) {
            setIsArtificiallyLoading(true);
            hasToasted.current = false;
        }

        // 2. When the server responds (success or error)
        if (fetcher.state === "idle" && fetcher.data && !hasToasted.current) {
            hasToasted.current = true;

            if (fetcher.data.success) {
                // Show toast immediately so it doesn't get lost if the component unmounts
                toast.success(fetcher.data.message);
                
                // Keep the "Deleting..." text for 3 seconds before resetting
                timer = setTimeout(() => setIsArtificiallyLoading(false), 3000);
            } else {
                toast.error(fetcher.data.message);
                setIsArtificiallyLoading(false);
            }
        }

        return () => clearTimeout(timer); 
    
    }, [fetcher.state, fetcher.data]);

    return (
        <fetcher.Form
            method="post"
            action={action}
            className="inline-block"
            onClick={(e) => e.stopPropagation()}
        >
            <input type="hidden" name="id" value={id} />
            {/* <button
                type="submit"
                name="intent"
                value="delete"
                disabled={isArtificiallyLoading}
                className="text-red-500 hover:text-red-700 font-medium text-sm ms-2 disabled:opacity-50"
            >
                {isArtificiallyLoading ? "Deleting..." : "Delete"}
            </button> */}
            <button
                type="submit"
                name="intent"
                value="delete"
                disabled={isArtificiallyLoading}
                title="Delete task"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
            >
                {isArtificiallyLoading ? (
                    <span className="text-xs">...</span>
                ) : (
                    <FiTrash2 size={18} />
                )}
            </button>
        </fetcher.Form>
    );
}