import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function ChamadaButtons() {
    return (
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <span>Solicite Um Orçamento</span>
            <FaWhatsapp className="ml-2" />
        </button>
    );
}
