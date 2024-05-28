import React, { useState } from 'react';
import { useController } from 'react-hook-form';
import { FaCloudDownloadAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import Select from 'react-select';

export const EmailInputComponent = ({ control, errMsg, name }) => {
    const emailController = useController({ name, control });
    return (
        <div className="bg-slate-100 w-full flex relative">
            <input
                type="email"
                {...emailController.field}
                placeholder="Enter your email"
                className="outline-none bg-transparent w-full"
            />
            <span className="text-red-500 text-sm absolute top-full left-0 mt-2">{errMsg}</span>
        </div>
    );
};

export const TextInputComponent = ({ control, errMsg, name }) => {
    const textController = useController({ name, control });
    return (
        <div className="bg-slate-100 w-full flex relative">
            <input
                type="text"
                {...textController.field}
                placeholder={`Enter your ${name}`}
                className="outline-none bg-transparent w-full"
            />
            <span className="text-red-500 text-sm absolute top-full left-0 mt-2">{errMsg}</span>
        </div>
    );
};

export const PriceInputComponent = ({ control, errMsg, name }) => {
    const textController = useController({ name, control });
    return (
        <div className="bg-slate-100 w-full flex relative">
            <input
                type="number"
                {...textController.field}
                placeholder={`Enter ${name}`}
                className="outline-none bg-transparent w-full"
            />
            <span className="text-red-500 text-sm absolute top-full left-0 mt-2">{errMsg}</span>
        </div>
    );
};
export const DiscountInputComponent = ({ control, errMsg, name }) => {
    const textController = useController({ name, control });
    return (
        <div className="bg-slate-100 w-full flex relative">
            <input
                type="number"
                {...textController.field}
                placeholder={`Enter ${name}`}
                className="outline-none bg-transparent w-full"
            />
            <span className="text-red-500 text-sm absolute top-full left-0 mt-2">{errMsg}</span>
        </div>
    );
};

export const URLInputComponent = ({ control, errMsg, name }) => {
    const urlController = useController({ name, control });
    return (
        <div className="bg-slate-100 w-full flex relative">
            <input
                type="url"
                {...urlController.field}
                placeholder={`Enter your ${name}`}
                className="outline-none bg-transparent w-full"
            />
            <span className="text-red-500 text-sm absolute top-full left-0 mt-2">{errMsg}</span>
        </div>
    );
};

export const TextAreaInputComponent = ({ control, errMsg, name }) => {
    const textAreaController = useController({ name, control });
    return (
        <div className="bg-slate-100 w-full flex relative">
            <textarea
                {...textAreaController.field}
                placeholder={`Enter your ${name}`}
                rows={3}
                style={{ resize: 'none' }}
                className="outline-none bg-transparent w-full"
            />
            <span className="text-red-500 text-sm absolute top-full left-0 mt-2">{errMsg}</span>
        </div>
    );
};

export const SelectDropdownComponent = ({ control, errMsg, name, options, setValue, defaultValue, isMultiple = false }) => {
    return (
        <div className="bg-slate-100 w-full flex relative">
            <Select
                options={options}
                isClearable
                name={name}
                isMulti={isMultiple}
                onChange={(selOpts) => setValue(name, selOpts)}
                defaultValue={defaultValue}
                className="h-full w-full outline-none bg-transparent"
            />
            <span className="text-red-500 text-sm absolute top-full left-0 mt-2">{errMsg}</span>
        </div>
    );
};

export const PasswordInput = ({ control, errMsg, name }) => {
    const passwordController = useController({ name, control });
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="bg-slate-100 w-full flex relative">
            <input
                type={showPassword ? 'text' : 'password'}
                {...passwordController.field}
                placeholder="Enter your password"
                className="outline-none bg-transparent w-full"
            />
            <span className="text-red-500 text-sm absolute top-full left-0 mt-2">{errMsg}</span>
            <div className="absolute inset-y-0 right-0 flex items-center pr-0" onClick={() => setShowPassword((prev) => !prev)}>
                <span>{showPassword ? <FaEye /> : <FaEyeSlash />}</span>
            </div>
        </div>
    );
};

export const ImageUploaderComponent = ({ control, setError, setThumb, name, errMsg, setValue }) => {
    const { field: { onChange } } = useController({ name, control });
    const [thumbnails, setThumbnails] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const allowed = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'];
        let validFiles = [];

        files.forEach(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            if (!allowed.includes(ext)) {
                setError(name, { message: 'Image format not supported' });
            } else if (file.size > 3000000) {
                setError(name, { message: 'Image size should be less than 3MB' });
            } else {
                validFiles.push(file);
            }
        });

        if (validFiles.length > 0) {
            const localThumbnails = validFiles.map(file => URL.createObjectURL(file));
            setThumbnails(localThumbnails);
            setThumb(validFiles);
            setValue(name, validFiles);
            onChange(validFiles);
        } else {
            setThumbnails([]);
            setValue(name, []);
            onChange([])
        }
    };

    return (
        <div>
                <label htmlFor='uploadImageInput' className='cursor-pointer flex flex-col items-center justify-center px-36 '>
                <span className='text-4xl '>
                    <FaCloudDownloadAlt />
                </span>
                <p className='text-sm mt-2'>Upload Image</p>
                <input
                    type='file'
                    id='uploadImageInput'
                    className='hidden'
                    accept='image/*'
                    multiple
                    onChange={handleFileChange}
                />
            </label>
            {errMsg && <p className="text-red-600 text-xs mt-2">{errMsg}</p>}
        </div>
    );
};

