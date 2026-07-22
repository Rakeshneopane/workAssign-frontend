import { useFetcher } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";

export function DeleteButton({ id, action }) {
    const fetcher = useFetcher();

    const isLoading =
        fetcher.state !== "idle" &&
        fetcher.formData?.get("intent") === "delete";

    useEffect(() => {
        if (fetcher.state === "loading" && fetcher.data?.success) {
            toast.success(fetcher.data.message);
        }

        if (
            fetcher.state === "loading" &&
            fetcher.data &&
            !fetcher.data.success
        ) {
            toast.error(fetcher.data.message);
        }
    }, [fetcher.state, fetcher.data]);

    return (
        <fetcher.Form
            method="post"
            action={action}
            className="inline-block"
            onClick={(e) => e.stopPropagation()}
        >
            <input type="hidden" name="id" value={id} />

            <button
                type="submit"
                name="intent"
                value="delete"
                disabled={isLoading}
                title="Delete"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isLoading ? (
                    <span className="text-xs font-semibold">...</span>
                ) : (
                    <FiTrash2 size={18} />
                )}
            </button>
        </fetcher.Form>
    );
}