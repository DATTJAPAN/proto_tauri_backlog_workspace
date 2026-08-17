"use client"

import * as React from "react"
import {Form, Field as FormischField, reset, useForm} from "@formisch/react"
import type {SubmitHandler} from "@formisch/react"
import {
    AlertCircleIcon,
    BookmarkIcon,
    CalendarDaysIcon,
    ClockIcon,
    CheckCircle2Icon,
    EyeIcon,
    FlagIcon,
    ListTodoIcon,
    PenLineIcon,
    UserIcon,
    TagIcon,
    LayersIcon,
    MilestoneIcon,
} from "lucide-react"
import {toast} from "sonner"
import * as v from "valibot"

import {backlog} from "@/backlog/Backlog"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {
    InputGroup,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import {
    NativeSelect,
    NativeSelectOption,
} from "@/components/ui/native-select"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {cn} from "@/lib/utils"
import {IssueMarkdown} from "./issue-markdown"
import {UserSelectPopover} from "@/components/shadcn"

const INITIAL_DESCRIPTION = "# Welcome to your wiki!\nA wiki is a Backlog page that allows for collaborative editing by its users.\n"

// Form Schema matching Backlog API v2 Add Issue constraints
const FormSchema = v.object({
    projectId: v.optional(v.nullable(v.union([v.string(), v.number()]))),
    title: v.pipe(
        v.string(),
        v.minLength(1, "Summary is required."),
        v.maxLength(255, "Summary must be 255 characters or less.")
    ),
    description: v.pipe(
        v.string(),
        v.minLength(20, "Description must be at least 20 characters.")
    ),
    issueTypeId: v.optional(v.string()),
    category: v.optional(v.string()),
    statusId: v.optional(v.string()),
    priorityId: v.optional(v.string()),
    milestone: v.optional(v.string()),
    version: v.optional(v.string()),
    startDate: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    estimatedHours: v.optional(
        v.pipe(
            v.string(),
            v.regex(/^\d*(\.\d+)?$/, "Estimated hours must be a valid number.")
        )
    ),
    actualHours: v.optional(
        v.pipe(
            v.string(),
            v.regex(/^\d*(\.\d+)?$/, "Actual hours must be a valid number.")
        )
    ),
    assignee: v.optional(v.nullable(v.string())),
})

interface CreateIssueFormProps {
    projectIdOrKey: number | string | null
}

export function CreateIssueForm({projectIdOrKey}: CreateIssueFormProps) {
    const [isScrolled, setIsScrolled] = React.useState(false)
    const sentinelRef = React.useRef<HTMLDivElement>(null)

    // Dialog state for mock submission
    const [showSubmitDialog, setShowSubmitDialog] = React.useState(false)
    const [submitData, setSubmitData] = React.useState<string>("")

    // Pre-cached query data
    const {data: categories = []} = backlog.projectCategory.useGetAll(projectIdOrKey)
    const {data: versionAndMilestones = []} = backlog.projectVersionAndMilestone.useGetAll(projectIdOrKey)
    const {data: issueTypes = []} = backlog.projectIssueTypes.useGetAll(projectIdOrKey)
    const {data: projectStatuses = []} = backlog.projectStatus.useGetAll(projectIdOrKey)
    const {data: priorities = []} = backlog.priority.useGetAll()
    const {data: projectUsers = []} = backlog.projectUsers.useGetAll(projectIdOrKey, {
        excludeGroupMembers: false,
    })

    const defaultIssueType = issueTypes[0] ?? null
    const defaultStatus = projectStatuses[0] ?? null
    const defaultPriority = priorities.find((p) => p.name === "Normal") ?? priorities[0] ?? null
    const defaultVersionAndMilestone = versionAndMilestones[0] ?? null
    const defaultCategory = categories[0] ?? null

    const form = useForm({
        schema: FormSchema,
        initialInput: {
            projectId: projectIdOrKey !== null ? String(projectIdOrKey) : undefined,
            title: "",
            description: defaultIssueType?.template_description || INITIAL_DESCRIPTION,
            issueTypeId: defaultIssueType ? String(defaultIssueType.id) : undefined,
            category: defaultCategory ? String(defaultCategory.id) : undefined,
            statusId: defaultStatus ? String(defaultStatus.id) : undefined,
            priorityId: defaultPriority ? String(defaultPriority.id) : undefined,
            milestone: defaultVersionAndMilestone ? String(defaultVersionAndMilestone.id) : undefined,
            version: defaultVersionAndMilestone ? String(defaultVersionAndMilestone.id) : undefined,
            startDate: "",
            dueDate: "",
            estimatedHours: "",
            actualHours: "",
            assignee: undefined,
        },
    })

    // Transform projectUsers into UserSelectOptions
    const userOptions = React.useMemo(() => {
        return projectUsers.map((user) => ({
            value: String(user.id),
            label: user.name || user.nulabAccount?.name || `User ${user.id}`,
            iconUrl: user.nulabAccount?.iconUrl,
        }))
    }, [projectUsers])

    // Shared options for Milestone and Version selects
    const versionAndMilestoneOptions = React.useMemo(() => {
        return [
            <NativeSelectOption key="none" value="">None</NativeSelectOption>,
            ...versionAndMilestones.map((item) => (
                <NativeSelectOption key={item.id} value={String(item.id)}>
                    {item.name}
                </NativeSelectOption>
            ))
        ]
    }, [versionAndMilestones])

    React.useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsScrolled(!entry.isIntersecting)
            },
            {threshold: [1.0]}
        )

        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [])

    const handleSubmit: SubmitHandler<typeof FormSchema> = (output) => {
        // Form parameters exact schema according to Backlog API v2 (POST /api/v2/issues)
        const apiPayload = {
            projectId: projectIdOrKey ? Number(projectIdOrKey) : (output.projectId ? Number(output.projectId) : undefined),
            summary: output.title,
            issueTypeId: output.issueTypeId ? Number(output.issueTypeId) : undefined,
            priorityId: output.priorityId ? Number(output.priorityId) : undefined,
            description: output.description || undefined,
            startDate: output.startDate || undefined,
            dueDate: output.dueDate || undefined,
            estimatedHours: output.estimatedHours ? Number(output.estimatedHours) : undefined,
            actualHours: output.actualHours ? Number(output.actualHours) : undefined,
            statusId: output.statusId ? Number(output.statusId) : undefined,
            assigneeId: output.assignee ? Number(output.assignee) : undefined,
            "categoryId[]": output.category ? [Number(output.category)] : undefined,
            "versionId[]": output.version ? [Number(output.version)] : undefined,
            "milestoneId[]": output.milestone ? [Number(output.milestone)] : undefined,
        }

        // Filter out undefined attributes for clean API payload output
        const cleanedPayload = Object.fromEntries(
            Object.entries(apiPayload).filter(([_, v]) => v !== undefined)
        )

        setSubmitData(JSON.stringify(cleanedPayload, null, 2))
        setShowSubmitDialog(true)

        toast.success("Issue payload generated!", {
            description: `Ready to send to Backlog API.`,
        })
    }

    return (
        <>
            <div className="w-full space-y-6">
                <Form of={form} id="create-issue-form" onSubmit={handleSubmit} className="w-full space-y-6">

                    {/* Observer Sentinel */}
                    <div ref={sentinelRef} className="h-px w-full -mb-px pointer-events-none"/>

                    {/* Sticky Header with Title & Actions */}
                    <div
                        className={cn(
                            "sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 bg-background py-2 transition-all duration-200 border-b border-transparent",
                            isScrolled && "py-3 border-b-2 border-primary"
                        )}
                    >
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Create Issues</h1>
                            <p className="text-xs text-muted-foreground">
                                Create a Task, Bug, or Chore Issue in Backlog project.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-none text-xs"
                                onClick={() => reset(form)}
                            >
                                Reset Form
                            </Button>
                            <Button
                                type="submit"
                                form="create-issue-form"
                                className="rounded-none font-medium"
                            >
                                Create Issue
                            </Button>
                        </div>
                    </div>

                    {/* Rich Text Notice Alert */}
                    <Alert
                        className="rounded-none border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-200">
                        <AlertCircleIcon className="size-4 text-amber-600 dark:text-amber-400"/>
                        <AlertTitle className="font-semibold">WYSIWYG Rich Text Editing Under Development</AlertTitle>
                        <AlertDescription className="text-xs">
                            Visual editing is under development. Please write directly in raw Markdown—it builds strong
                            documentation habits essential for developer-centric workflows. Use
                            the <strong>Preview</strong> tab to inspect formatting.
                        </AlertDescription>
                    </Alert>

                    {/* 2-Column Responsive Grid Layout */}
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">

                        {/* Left Main Content Area */}
                        <div className="space-y-6 lg:col-span-9">
                            <FieldGroup>
                                {/* Issue Title Field */}
                                <FormischField of={form} path={["title"]}>
                                    {(field) => (
                                        <Field data-invalid={field.errors !== null} className="w-full">
                                            <FieldLabel htmlFor="form-issue-title" className="text-sm font-medium">
                                                Issue Title
                                            </FieldLabel>
                                            <Input
                                                {...field.props}
                                                id="form-issue-title"
                                                value={field.input ?? ""}
                                                aria-invalid={field.errors !== null}
                                                placeholder="e.g. Backend - Implement Application User"
                                                autoComplete="off"
                                                className="h-12 w-full rounded-none shadow-none text-lg"
                                            />
                                            {field.errors && (
                                                <FieldError
                                                    errors={field.errors.map((message) => ({message}))}
                                                />
                                            )}
                                        </Field>
                                    )}
                                </FormischField>

                                {/* Issue Description Field with Write / Preview Tabs */}
                                <FormischField of={form} path={["description"]}>
                                    {(field) => {
                                        const descriptionValue = typeof field.input === "string" ? field.input : ""

                                        return (
                                            <Field data-invalid={field.errors !== null} className="w-full">
                                                <div className="flex items-center justify-between pb-2">
                                                    <FieldLabel htmlFor="form-issue-description"
                                                                className="text-sm font-medium">
                                                        Issue Description
                                                    </FieldLabel>
                                                    <span className="tabular-nums text-xs text-muted-foreground">
                                                        {descriptionValue.length} characters
                                                    </span>
                                                </div>

                                                <Tabs defaultValue="write" className="w-full">
                                                    <TabsList
                                                        className="inline-flex h-9 items-center rounded-none border bg-muted/60 p-1">
                                                        <TabsTrigger
                                                            value="write"
                                                            className="inline-flex items-center gap-1.5 rounded-none px-4 py-1 text-xs font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                                        >
                                                            <PenLineIcon className="size-3.5"/>
                                                            Write
                                                        </TabsTrigger>
                                                        <TabsTrigger
                                                            value="preview"
                                                            className="inline-flex items-center gap-1.5 rounded-none px-4 py-1 text-xs font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                                        >
                                                            <EyeIcon className="size-3.5"/>
                                                            Preview
                                                        </TabsTrigger>
                                                    </TabsList>

                                                    <TabsContent value="write" className="mt-2">
                                                        <InputGroup className="rounded-none shadow-none">
                                                            <InputGroupTextarea
                                                                {...field.props}
                                                                id="form-issue-description"
                                                                value={descriptionValue}
                                                                placeholder="Include steps to reproduce, expected behavior, and code blocks..."
                                                                rows={22}
                                                                className="min-h-96 w-full resize-y rounded-none font-mono text-sm [font-variant-ligatures:none]"
                                                                aria-invalid={field.errors !== null}
                                                            />
                                                        </InputGroup>
                                                    </TabsContent>

                                                    <TabsContent value="preview" className="mt-2">
                                                        <div
                                                            className="min-h-96 w-full rounded-none border bg-background p-4">
                                                            <IssueMarkdown
                                                                issueIdOrKey=""
                                                                content={descriptionValue}
                                                                className="typeset-issue"
                                                                attachments={[]}
                                                            />
                                                        </div>
                                                    </TabsContent>
                                                </Tabs>

                                                <FieldDescription>
                                                    Use headings, lists, tables, and code blocks to structure details.
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
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-4 lg:col-span-3">

                            {/* 1. General Details */}
                            <Card className="rounded-none shadow-none">
                                <CardHeader className="border-b py-3 px-4">
                                    <CardTitle
                                        className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                        General Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4">

                                    {/* Issue Type Select */}
                                    <FormischField of={form} path={["issueTypeId"]}>
                                        {(field) => (
                                            <Field data-invalid={field.errors !== null}>
                                                <FieldLabel className="flex items-center gap-2 text-sm font-medium">
                                                    <BookmarkIcon className="size-3.5 text-muted-foreground"/>
                                                    Issue Type
                                                </FieldLabel>
                                                <NativeSelect
                                                    value={String(field.input ?? "")}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    className="h-8 w-full rounded-none text-xs"
                                                >
                                                    {issueTypes.map((type) => (
                                                        <NativeSelectOption key={type.id} value={String(type.id)}>
                                                            {type.name}
                                                        </NativeSelectOption>
                                                    ))}
                                                </NativeSelect>
                                            </Field>
                                        )}
                                    </FormischField>

                                    {/* UserSelectCombobox for Assignee */}
                                    <FormischField of={form} path={["assignee"]}>
                                        {(field) => (
                                            <Field data-invalid={field.errors !== null}>
                                                <FieldLabel className="flex items-center gap-2 text-sm font-medium">
                                                    <UserIcon className="size-3.5 text-muted-foreground"/>
                                                    Assignee
                                                </FieldLabel>
                                                <UserSelectPopover
                                                    options={userOptions}
                                                    value={field.input as string | null}
                                                    onValueChange={(val) => field.onChange(val || undefined)}
                                                    placeholder="No assignee"
                                                    searchPlaceholder="Search User"
                                                />
                                            </Field>
                                        )}
                                    </FormischField>

                                    {/* Status Select */}
                                    <FormischField of={form} path={["statusId"]}>
                                        {(field) => (
                                            <Field data-invalid={field.errors !== null}>
                                                <FieldLabel className="flex items-center gap-2 text-sm font-medium">
                                                    <ListTodoIcon className="size-3.5 text-muted-foreground"/>
                                                    Status
                                                </FieldLabel>
                                                <NativeSelect
                                                    value={String(field.input ?? "")}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    className="h-8 w-full rounded-none text-xs"
                                                >
                                                    {projectStatuses.map((status) => (
                                                        <NativeSelectOption key={status.id} value={String(status.id)}>
                                                            {status.name}
                                                        </NativeSelectOption>
                                                    ))}
                                                </NativeSelect>
                                            </Field>
                                        )}
                                    </FormischField>

                                    {/* Priority Select */}
                                    <FormischField of={form} path={["priorityId"]}>
                                        {(field) => (
                                            <Field data-invalid={field.errors !== null}>
                                                <FieldLabel className="flex items-center gap-2 text-sm font-medium">
                                                    <FlagIcon className="size-3.5 text-muted-foreground"/>
                                                    Priority
                                                </FieldLabel>
                                                <NativeSelect
                                                    value={String(field.input ?? "")}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    className="h-8 w-full rounded-none text-xs"
                                                >
                                                    {priorities.map((priority) => (
                                                        <NativeSelectOption key={priority.id}
                                                                            value={String(priority.id)}>
                                                            {priority.name}
                                                        </NativeSelectOption>
                                                    ))}
                                                </NativeSelect>
                                            </Field>
                                        )}
                                    </FormischField>

                                </CardContent>
                            </Card>

                            {/* 2. Dates & Hours */}
                            <Card className="rounded-none shadow-none">
                                <CardHeader className="border-b py-3 px-4">
                                    <CardTitle
                                        className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                        Dates & Hours
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4">

                                    {/* Dates Pair */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <FormischField of={form} path={["startDate"]}>
                                            {(field) => (
                                                <Field data-invalid={field.errors !== null}>
                                                    <FieldLabel
                                                        className="flex items-center gap-1.5 text-xs font-medium truncate">
                                                        <CalendarDaysIcon className="size-3 text-muted-foreground"/>
                                                        Start Date
                                                    </FieldLabel>
                                                    <Input
                                                        {...field.props}
                                                        type="date"
                                                        value={field.input ?? ""}
                                                        className="h-8 w-full rounded-none shadow-none text-xs px-2"
                                                    />
                                                </Field>
                                            )}
                                        </FormischField>

                                        <FormischField of={form} path={["dueDate"]}>
                                            {(field) => (
                                                <Field data-invalid={field.errors !== null}>
                                                    <FieldLabel
                                                        className="flex items-center gap-1.5 text-xs font-medium truncate">
                                                        <CalendarDaysIcon className="size-3 text-muted-foreground"/>
                                                        Due Date
                                                    </FieldLabel>
                                                    <Input
                                                        {...field.props}
                                                        type="date"
                                                        value={field.input ?? ""}
                                                        className="h-8 w-full rounded-none shadow-none text-xs px-2"
                                                    />
                                                </Field>
                                            )}
                                        </FormischField>
                                    </div>

                                    {/* Hours Pair */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <FormischField of={form} path={["estimatedHours"]}>
                                            {(field) => (
                                                <Field data-invalid={field.errors !== null}>
                                                    <FieldLabel
                                                        className="flex items-center gap-1.5 text-xs font-medium truncate">
                                                        <ClockIcon className="size-3 text-muted-foreground"/>
                                                        Estimated (h)
                                                    </FieldLabel>
                                                    <Input
                                                        {...field.props}
                                                        type="number"
                                                        min="0"
                                                        step="0.25"
                                                        placeholder="e.g. 8"
                                                        value={field.input ?? ""}
                                                        onChange={(e) => field.onChange(e.target.value.replace(/[^0-9.]/g, ""))}
                                                        className="h-8 w-full rounded-none shadow-none text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    />
                                                    {field.errors && (
                                                        <FieldError
                                                            errors={field.errors.map((message) => ({message}))}/>
                                                    )}
                                                </Field>
                                            )}
                                        </FormischField>

                                        <FormischField of={form} path={["actualHours"]}>
                                            {(field) => (
                                                <Field data-invalid={field.errors !== null}>
                                                    <FieldLabel
                                                        className="flex items-center gap-1.5 text-xs font-medium truncate">
                                                        <CheckCircle2Icon className="size-3 text-muted-foreground"/>
                                                        Actual (h)
                                                    </FieldLabel>
                                                    <Input
                                                        {...field.props}
                                                        type="number"
                                                        min="0"
                                                        step="0.25"
                                                        placeholder="e.g. 4"
                                                        value={field.input ?? ""}
                                                        onChange={(e) => field.onChange(e.target.value.replace(/[^0-9.]/g, ""))}
                                                        className="h-8 w-full rounded-none shadow-none text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    />
                                                    {field.errors && (
                                                        <FieldError
                                                            errors={field.errors.map((message) => ({message}))}/>
                                                    )}
                                                </Field>
                                            )}
                                        </FormischField>
                                    </div>

                                </CardContent>
                            </Card>

                            {/* 3. Planning & Target */}
                            <Card className="rounded-none shadow-none">
                                <CardHeader className="border-b py-3 px-4">
                                    <CardTitle
                                        className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                        Planning & Target
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4">

                                    {/* Category */}
                                    <FormischField of={form} path={["category"]}>
                                        {(field) => (
                                            <Field data-invalid={field.errors !== null}>
                                                <FieldLabel className="flex items-center gap-2 text-sm font-medium">
                                                    <TagIcon className="size-3.5 text-muted-foreground"/>
                                                    Category
                                                </FieldLabel>
                                                <NativeSelect
                                                    value={String(field.input ?? "")}
                                                    onChange={(e) => field.onChange(e.target.value || undefined)}
                                                    className="h-8 w-full rounded-none text-xs"
                                                >
                                                    <NativeSelectOption value="">None</NativeSelectOption>
                                                    {categories.map((cat) => (
                                                        <NativeSelectOption key={cat.id} value={String(cat.id)}>
                                                            {cat.name}
                                                        </NativeSelectOption>
                                                    ))}
                                                </NativeSelect>
                                            </Field>
                                        )}
                                    </FormischField>

                                    {/* Milestone */}
                                    <FormischField of={form} path={["milestone"]}>
                                        {(field) => (
                                            <Field data-invalid={field.errors !== null}>
                                                <FieldLabel className="flex items-center gap-2 text-sm font-medium">
                                                    <MilestoneIcon className="size-3.5 text-muted-foreground"/>
                                                    Milestone
                                                </FieldLabel>
                                                <NativeSelect
                                                    value={String(field.input ?? "")}
                                                    onChange={(e) => field.onChange(e.target.value || undefined)}
                                                    className="h-8 w-full rounded-none text-xs"
                                                >
                                                    {versionAndMilestoneOptions}
                                                </NativeSelect>
                                            </Field>
                                        )}
                                    </FormischField>

                                    {/* Version */}
                                    <FormischField of={form} path={["version"]}>
                                        {(field) => (
                                            <Field data-invalid={field.errors !== null}>
                                                <FieldLabel className="flex items-center gap-2 text-sm font-medium">
                                                    <LayersIcon className="size-3.5 text-muted-foreground"/>
                                                    Version
                                                </FieldLabel>
                                                <NativeSelect
                                                    value={String(field.input ?? "")}
                                                    onChange={(e) => field.onChange(e.target.value || undefined)}
                                                    className="h-8 w-full rounded-none text-xs"
                                                >
                                                    {versionAndMilestoneOptions}
                                                </NativeSelect>
                                            </Field>
                                        )}
                                    </FormischField>

                                </CardContent>
                            </Card>

                            {/* Bottom Action Block */}
                            <div className="flex flex-col gap-2 pt-2">
                                <Button
                                    type="submit"
                                    form="create-issue-form"
                                    className="w-full rounded-none font-medium"
                                >
                                    Create Issue
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full rounded-none text-xs"
                                    onClick={() => reset(form)}
                                >
                                    Reset Form
                                </Button>
                            </div>

                        </div>
                    </div>
                </Form>
            </div>

            {/* Mock Submission Dialog */}
            <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <DialogContent className="max-w-2xl rounded-none">
                    <DialogHeader>
                        <DialogTitle>Mock Submission Payload</DialogTitle>
                        <DialogDescription>
                            This is the JSON payload that will be sent to the Backlog API to create the issue.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="rounded-none border bg-muted p-4 max-h-[500px] overflow-y-auto">
                        <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-words">
                            {submitData}
                        </pre>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}