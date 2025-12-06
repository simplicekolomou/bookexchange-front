import {Button, FileUpload, Float, useFileUploadContext} from "@chakra-ui/react";
import {useEffect} from "react";
import {LuFileImage, LuX} from "react-icons/lu";

export const FileUploadField = ({ onChange, label }: {
    value: File | null;
    onChange: (f: File | null) => void;
    label: string;
}) => {
    const FileUploadList = () => {
        const fileUpload = useFileUploadContext();
        const files = fileUpload.acceptedFiles;

        // sync to RHF when files change
        useEffect(() => {
            if (files.length > 0) {
                onChange(files[0]); // only first file
            } else {
                onChange(null);
            }
        }, [files]);

        if (files.length === 0) return null;

        return (
            <FileUpload.ItemGroup>
                {files.map((file) => (
                    <FileUpload.Item key={file.name} file={file} w="auto" boxSize="20" p="2" mx="auto">
                        <FileUpload.ItemPreviewImage />
                        <Float placement="top-end">
                            <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                                <LuX />
                            </FileUpload.ItemDeleteTrigger>
                        </Float>
                    </FileUpload.Item>
                ))}
            </FileUpload.ItemGroup>
        );
    };

    return (
        <FileUpload.Root accept="image/*">
            <FileUpload.Label>{label}</FileUpload.Label>
            <FileUpload.HiddenInput />
            <FileUpload.Trigger asChild>
                <Button variant="outline" size="sm" mx="auto">
                    <LuFileImage /> Upload Images
                </Button>
            </FileUpload.Trigger>
            <FileUploadList />
        </FileUpload.Root>
    );
};
