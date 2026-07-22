// export default function StatCard({
//     icon,
//     title,
//     value,
//     color
// }) {
//     return (
//         <div className="rounded-3xl bg-white p-6 shadow-md border">

//             <div
//                 className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}
//             >
//                 {icon}
//             </div>

//             <p className="text-slate-500">
//                 {title}
//             </p>

//             <h2 className="mt-2 text-4xl font-bold">
//                 {value}
//             </h2>

//         </div>
//     );
// }


export default function StatCard({
    icon: Icon,
    title,
    value,
    iconColor = "text-blue-600",
    iconBg = "bg-blue-50",
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            {Icon && (
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
                    <Icon className={`text-2xl ${iconColor}`} />
                </div>
            )}

            <p className="text-sm text-slate-500">{title}</p>
            <h2 className="mt-2 text-3xl font-bold">{value}</h2>

        </div>
    );
}