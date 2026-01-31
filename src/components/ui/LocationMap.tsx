import React from 'react';

interface LocationMapProps {
    className?: string;
}

export default function LocationMap({ className }: LocationMapProps) {
    // Address: Calle de la Azalea 97, 28109 Alcobendas, Spain
    // Using Google Maps Embed API (or basic iframe without API key for simple display)
    const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3032.557342689539!2d-3.659976923440798!3d40.52924197142168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422bd9f3453b51%3A0x6d64985207755f4!2sC.%20de%20la%20Azalea%2C%2097%2C%2028109%20Alcobendas%2C%20Madrid%2C%20Spain!5e0!3m2!1sen!2sus!4v1706112345678!5m2!1sen!2sus";

    return (
        <div className={`w-full h-80 rounded-3xl overflow-hidden shadow-elevation-2 border border-surface-variant ${className}`}>
            <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Event Location"
                className="filter contrast-[0.9] sepia-[0.1]" // Subtle warm tone to match theme
            />
        </div>
    );
}
