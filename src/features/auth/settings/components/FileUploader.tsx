"use client"

import {
    FileUpload,
    Float,
    useFileUploadContext,
} from "@chakra-ui/react"
import { LuX } from "react-icons/lu"

export const FileUploader = () => {
    const fileUpload = useFileUploadContext()
    const files = fileUpload.acceptedFiles || []
    if (files.length === 0) return null
    const file = files[0]

    return (
        <FileUpload.ItemGroup>
            <FileUpload.Item
                w="auto"
                boxSize="20"
                borderRadius="50px"
                overflow="hidden"
                p="2"
                file={file}
                key={file.name}
            >
                <FileUpload.ItemPreviewImage />
                <Float placement="top-end">
                    <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                        <LuX />
                    </FileUpload.ItemDeleteTrigger>
                </Float>
            </FileUpload.Item>
        </FileUpload.ItemGroup>
    )
}