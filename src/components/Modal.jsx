export function Modal({ children, onClose }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative flex max-h-[90vh] w-full max-w-4xl min-h-0 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-2xl text-slate-500 transition hover:bg-slate-100"
                >
                    &times;
                </button>

                {children}
            </div>
        </div>
    );
}

export function ModalBody({ children }) {
    return (
        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
            {children}
        </div>
    );
}

export function ModalFooter({
    onCancel,
    isSubmitting,
    isEdit,
    createLabel,
    editLabel = "Save Changes",
}) {
    return (
        <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 px-8 py-6">
            <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-100"
            >
                Cancel
            </button>

            <button
                type="submit"
                name="intent"
                value={isEdit ? "update" : "create"}
                disabled={isSubmitting}
                className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
                {isSubmitting ? "Saving..." : isEdit ? editLabel : createLabel}
            </button>
        </div>
    );
}

export function ModalHeader({ title, description }) {
    return (
        <div className="shrink-0 border-b border-slate-200 px-8 py-6">
            <h2 className="text-3xl font-bold text-slate-900">
                {title}
            </h2>

            {description && (
                <p className="mt-2 text-slate-500">
                    {description}
                </p>
            )}
        </div>
    );
}