
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    onItemsPerPageChange: (count: number) => void;
    totalItems: number;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems
}) => {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            {/* Items Info */}
            <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">
                    Affichage <strong className="text-slate-900">{startItem}-{endItem}</strong> sur <strong className="text-slate-900">{totalItems}</strong> produits
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Par page:</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0A7D3E]/20"
                    >
                        {[8, 12, 16, 24, 32].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-slate-600 hover:bg-[#0A7D3E] hover:text-white hover:border-[#0A7D3E] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-600 disabled:hover:border-gray-200"
                >
                    <ChevronLeft size={18} />
                </button>

                {getPageNumbers().map((page, idx) => (
                    <button
                        key={idx}
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        disabled={page === '...'}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${page === currentPage
                                ? 'bg-[#0A7D3E] text-white shadow-lg shadow-[#0A7D3E]/30'
                                : page === '...'
                                    ? 'cursor-default text-slate-400'
                                    : 'border border-gray-200 text-slate-600 hover:bg-[#0A7D3E]/10 hover:border-[#0A7D3E]/30'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-slate-600 hover:bg-[#0A7D3E] hover:text-white hover:border-[#0A7D3E] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-600 disabled:hover:border-gray-200"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};
