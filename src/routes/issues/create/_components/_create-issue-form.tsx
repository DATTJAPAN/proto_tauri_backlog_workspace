"use client"

import * as React from "react"
import {Form, Field as FormischField, useForm} from "@formisch/react"
import type {SubmitHandler} from "@formisch/react"
import {
    $convertToMarkdownString,
    CHECK_LIST,
    ELEMENT_TRANSFORMERS,
    MULTILINE_ELEMENT_TRANSFORMERS,
    TEXT_FORMAT_TRANSFORMERS,
    TEXT_MATCH_TRANSFORMERS,
} from "@lexical/markdown"
import type {EditorState} from "lexical"
import * as v from "valibot"

import {EMOJI} from "@/components/editor/transformers/markdown-emoji-transformer"
import {HR} from "@/components/editor/transformers/markdown-hr-transformer"
import {IMAGE} from "@/components/editor/transformers/markdown-image-transformer"
import {TABLE} from "@/components/editor/transformers/markdown-table-transformer"
import {Editor} from "@/components/ui/editor-x"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input"

const MARKDOWN_TRANSFORMERS = [
    TABLE,
    HR,
    IMAGE,
    EMOJI,
    CHECK_LIST,
    ...ELEMENT_TRANSFORMERS,
    ...MULTILINE_ELEMENT_TRANSFORMERS,
    ...TEXT_FORMAT_TRANSFORMERS,
    ...TEXT_MATCH_TRANSFORMERS,
]

const FormSchema = v.object({
    title: v.pipe(
        v.string(),
        v.minLength(5, "Bug title must be at least 5 characters.")
    ),
    description: v.pipe(
        v.string(),
        v.minLength(20, "Description must be at least 20 characters.")
    ),
})

export function CreateIssueForm() {
    const form = useForm({
        schema: FormSchema,
        initialInput: {
            title: "",
            description: "",
        },
    })

    const handleSubmit: SubmitHandler<typeof FormSchema> = (output) => {
        console.log("Form Output:", JSON.stringify(output, null, 2))
    }

    return (
        <div className="w-full space-y-6 p-6">
            <Form of={form} id="form-formisch-demo" onSubmit={handleSubmit} className="w-full">
                <FieldGroup className="w-full">
                    {/* Issue Title Field */}
                    <FormischField of={form} path={["title"]}>
                        {(field) => (
                            <Field data-invalid={field.errors !== null} className="w-full">
                                <FieldLabel htmlFor="form_issue_title">
                                    Issue Title
                                </FieldLabel>
                                <Input
                                    {...field.props}
                                    id="form_issue_title"
                                    value={field.input ?? ""}
                                    aria-invalid={field.errors !== null}
                                    placeholder="e.g. Backend - Implement Application User"
                                    autoComplete="off"
                                    className="w-full text-lg"
                                />
                                {field.errors && (
                                    <FieldError
                                        errors={field.errors.map((message) => ({message}))}
                                    />
                                )}
                            </Field>
                        )}
                    </FormischField>
                    {/* Issue Description Field */}
                    <FormischField of={form} path={["description"]}>
                        {(field) => {
                            const descriptionValue = typeof field.input === "string" ? field.input : ""

                            return (
                                <Field data-invalid={field.errors !== null} className="w-full">
                                    <div className="flex items-center justify-between pb-1">
                                        <FieldLabel htmlFor="form_issue_description">
                                            Issue Description
                                        </FieldLabel>
                                        <span className="tabular-nums text-xs text-muted-foreground">
                                            {descriptionValue.length} characters
                                        </span>
                                    </div>

                                    <EditorWrapper
                                        onMarkdownChange={(markdown) => {
                                            field.onChange(markdown)
                                        }}
                                    />

                                    <FieldDescription>
                                        Include steps to reproduce, expected behavior, and code blocks using Markdown.
                                    </FieldDescription>

                                    {field.errors && (
                                        <FieldError
                                            errors={field.errors.map((message) => ({message}))}
                                        />
                                    )}
                                </Field>
                            )
                        }}
                    </FormischField>
                </FieldGroup>
            </Form>
        </div>
    )
}

const EditorWrapper = React.memo(function EditorWrapper({
                                                            onMarkdownChange,
                                                        }: {
    onMarkdownChange: (markdown: string) => void
}) {
    const timerRef = React.useRef<NodeJS.Timeout | null>(null)

    const handleChange = React.useCallback(
        (editorState: EditorState) => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }

            timerRef.current = setTimeout(() => {
                editorState.read(() => {
                    const markdown = $convertToMarkdownString(MARKDOWN_TRANSFORMERS)
                    console.log("Captured Markdown:", markdown)
                    onMarkdownChange(markdown)
                })
            }, 100)
        },
        [onMarkdownChange, timerRef.current]
    )

    React.useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    return <Editor
        enableTable
        onChange={handleChange}/>
})