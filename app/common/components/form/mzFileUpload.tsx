import React, { useRef, useState } from 'react';
import styles from './mzFileUpload.module.scss';

const MzFileUpload: React.FC = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    return (
        <div className={styles.fileUploadWrapper}>
            <input type="file" ref={fileInputRef} onChange={handleChange} />
            {preview && <img src={preview} alt="미리보기" className={styles.preview} />}
        </div>
    );
};

export default MzFileUpload; 