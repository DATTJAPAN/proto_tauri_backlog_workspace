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
} from "lucide-react"
import {toast} from "sonner"
import * as v from "valibot"

import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
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

const INITIAL_DESCRIPTION = "# Welcome to your wiki!\n" +
    "A wiki is a Backlog page that allows for collaborative editing by its users. This means your whole team can add to, edit, or remove elements of its content and structure.\n" +
    "\n" +
    "Wiki's are highly adaptable and can be used for anything from tutorials and best-practices to meeting notes and progress updates.\n" +
    "\n" +
    "## Information you may want to include in a wiki:\n" +
    "\n" +
    "* A summary of what the wiki is about,\n" +
    "* Important dates & deadlines,\n" +
    "* Workflows or instructions for your team,\n" +
    "* Points of contact for questions or requests, and\n" +
    "* Any additional resources.\n" +
    "\n" +
    "## Formatting rule\n" +
    "Using your wiki toolbar, you can format any text on your wiki page to make it easier for users to read.\n" +
    "\n" +
    "## Headers\n" +
    "Use headers to establish your contents hierarchy and distinguish different sections.\n" +
    "\n" +
    "# Header1\n" +
    "## Header2\n" +
    "### Header3\n" +
    "#### Header4\n" +
    "##### Header5\n" +
    "\n" +
    "## Formatting Text\n" +
    "Format words using the Bold, Italic, and Strike options for emphasis.\n" +
    "\n" +
    "Include quotes and insert emojis.\n" +
    "\n" +
    "> \"Mama always said life is like a box of chocolates. You never know what you're gonna get. :) \"\n" +
    "\n" +
    "And even include code!\n" +
    "\n" +
    "```\n" +
    "package helloworld;\n" +
    "public class Hello {\n" +
    "  public String sayHello {\n" +
    "    return \"Hello\";\n" +
    "  }\n" +
    "}\n" +
    "```\n" +
    "\n" +
    "Note: More formatting options are available in the \"Formatting Rules\" card located right next to your wiki editor.\n" +
    "\n" +
    "## Lists & Tables\n" +
    "Create bulleted lists, numbered lists, or tables to outline instructions and relay information.\n" +
    "\n" +
    "### Bulleted List Example\n" +
    "\n" +
    "* Item 1\n" +
    "* Item 2\n" +
    "* Item 3\n" +
    "\n" +
    "### Numbered List Example\n" +
    "\n" +
    "1. Item 1\n" +
    "2. Item 2\n" +
    "3. Item 3\n" +
    "\n" +
    "### Table Example\n" +
    "| Header 1 | Header 2 | Header 3 |\n" +
    "| ------------- | ------------- | ------------- |\n" +
    "| Title | Info | Details |\n" +
    "| Title | Info | Details |\n" +
    "\n" +
    "## Adding links\n" +
    "You can add useful hyperlinks to:\n" +
    "\n" +
    "* http://www.backlogtool.com/\n" +
    "* [Backlog](http://www.backlogtool.com/)\n" +
    "\n" +
    "## Tagging\n" +
    "Be sure to tag your wiki to make it easy to search for later.\n" +
    "\n" +
    "Create new tags by enclosing a tag name in square brackets before your wiki page's name, e.g. [tag1][tag2]Page Name.\n" +
    "\n" +
    "Later on, you can search wikis by tags or keywords.\n" +
    "\n" +
    "## Embedding Cacoo diagrams\n" +
    "If you're also a user of Nulab's online diagramming tool, [Cacoo](http://cacoo.com), you can embed diagrams right in your wiki page for your team to see using the Cacoo icon in your wiki toolbar.\n" +
    "\n" +
    "## Attaching files\n" +
    "Once you save your wiki, you can add any relevant files your team may need to reference.\n" +
    "\n" +
    "## Getting Started\n" +
    "To create a new wiki, click the \"+\" icon at the top of this page."

const FormSchema = v.object({
    title: v.pipe(
        v.string(),
        v.minLength(5, "Title must be at least 5 characters.")
    ),
    description: v.pipe(
        v.string(),
        v.minLength(20, "Description must be at least 20 characters.")
    ),
    issueType: v.optional(v.string()),
    category: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    startDate: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    estimatedHours: v.optional(v.string()),
    actualHours: v.optional(v.string()),
    assignee: v.optional(v.string()),
})

const MOCK_USERS = [
    {id: "unassigned", name: "Unassigned", fallback: "?"},
    {id: "u1", name: "Alex Chen", fallback: "AC"},
    {id: "u2", name: "Sarah Jenkins", fallback: "SJ"},
    {id: "u3", name: "Kenji Sato", fallback: "KS"},
    {id: "u4", name: "Maria Garcia", fallback: "MG"},
]

export function CreateIssueForm() {
    const [isScrolled, setIsScrolled] = React.useState(false)
    const sentinelRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsScrolled(!entry.isIntersecting)
            },
            { threshold: [1.0] }
        )

        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [])

    const form = useForm({
        schema: FormSchema,
        initialInput: {
            title: "",
            description: INITIAL_DESCRIPTION,
            issueType: "Bug",
            category: "Frontend",
            status: "Open",
            priority: "Normal",
            startDate: "",
            dueDate: "",
            estimatedHours: "",
            actualHours: "",
            assignee: "unassigned",
        },
    })

    const handleSubmit: SubmitHandler<typeof FormSchema> = (output) => {
        toast.success("Issue submitted successfully!", {
            description: `Title: ${output.title}`,
        })
        console.log("Form Output:", JSON.stringify(output, null, 2))
    }

    return (
        <div className="w-full space-y-6">
            <Form of={form} id="create-issue-form" onSubmit={handleSubmit} className="w-full space-y-6">

                {/* 1px Intersection Observer Sentinel */}
                <div ref={sentinelRef} className="h-px w-full -mb-px pointer-events-none" />

                {/* Sticky Header with Restored Title & Actions */}
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
                <Alert className="rounded-none border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-200">
                    <AlertCircleIcon className="size-4 text-amber-600 dark:text-amber-400"/>
                    <AlertTitle className="font-semibold">WYSIWYG Rich Text Editing Under Development</AlertTitle>
                    <AlertDescription className="text-xs">
                        Visual editing is under development. Please write directly in raw Markdown—it builds strong documentation habits essential for developer-centric workflows. Use the <strong>Preview</strong> tab to inspect formatting.
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
                                                <FieldLabel htmlFor="form-issue-description" className="text-sm font-medium">
                                                    Issue Description
                                                </FieldLabel>
                                                <span className="tabular-nums text-xs text-muted-foreground">
                                                    {descriptionValue.length} characters
                                                </span>
                                            </div>

                                            <Tabs defaultValue="write" className="w-full">
                                                <TabsList className="inline-flex h-9 items-center rounded-none border bg-muted/60 p-1">
                                                    <TabsTrigger
                                                        value="write"
                                                        className="inline-flex items-center gap-1.5 rounded-none px-4 py-1 text-xs font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                                    >
                                                        <PenLineIcon className="size-3.5" />
                                                        Write
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="preview"
                                                        className="inline-flex items-center gap-1.5 rounded-none px-4 py-1 text-xs font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                                    >
                                                        <EyeIcon className="size-3.5" />
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
                                                            className="min-h-96 w-full resize-y rounded-none font-mono text-sm"
                                                            aria-invalid={field.errors !== null}
                                                        />
                                                    </InputGroup>
                                                </TabsContent>

                                                <TabsContent value="preview" className="mt-2">
                                                    <div className="min-h-96 w-full rounded-none border bg-background p-4">
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

                    {/* Right Metadata / Details Sidebar */}
                    <div className="space-y-6 lg:col-span-3">

                        {/* Additional Details Card */}
                        <Card className="rounded-none shadow-none">
                            <CardHeader className="border-b">
                                <CardTitle className="text-base font-semibold">Additional Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">

                                {/* Issue Type */}
                                <FormischField of={form} path={["issueType"]}>
                                    {(field) => (
                                        <Field data-invalid={field.errors !== null}>
                                            <FieldLabel className="flex items-center gap-2 text-sm font-medium">
                                                <BookmarkIcon className="size-3.5 text-muted-foreground"/>
                                                Issue Type
                                            </FieldLabel>
                                            <NativeSelect
                                                value={field.input ?? "Bug"}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                className="h-8 w-full rounded-none text-xs"
                                            >
                                                <NativeSelectOption value="Bug">Bug</NativeSelectOption>
                                                <NativeSelectOption value="Task">Task</NativeSelectOption>
                                                <NativeSelectOption value="Request">Request</NativeSelectOption>
                                                <NativeSelectOption value="Other">Other</NativeSelectOption>
                                            </NativeSelect>
                                        </Field>
                                    )}
                                </FormischField>

                                {/* Category */}
                                <FormischField of={form} path={["category"]}>
                                    {(field) => (
                                        <Field data-invalid={field.errors !== null}>
                                            <FieldLabel className="flex items-center gap-2 text-sm font-medium">
                                                <TagIcon className="size-3.5 text-muted-foreground"/>
                                                Category
                                            </FieldLabel>
                                            <NativeSelect
                                                value={field.input ?? "Frontend"}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                className="h-8 w-full rounded-none text-xs"
                                            >
                                                <NativeSelectOption value="Frontend">Frontend</NativeSelectOption>
                                                <NativeSelectOption value="Backend">Backend</NativeSelectOption>
                                                <NativeSelectOption value="DevOps">DevOps</NativeSelectOption>
                                                <NativeSelectOption value="Design">Design</NativeSelectOption>
                                            </NativeSelect>
                                        </Field>
                                    )}
                                </FormischField>

                                {/* Status */}
                                <FormischField of={form} path={["status"]}>
                                    {(field) => (
                                        <Field data-invalid={field.errors !== null}>
                                            <FieldLabel className="flex items-center gap-2 text-sm font-medium">
                                                <ListTodoIcon className="size-3.5 text-muted-foreground"/>
                                                Status
                                            </FieldLabel>
                                            <NativeSelect
                                                value={field.input ?? "Open"}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                className="h-8 w-full rounded-none text-xs"
                                            >
                                                <NativeSelectOption value="Open">Open</NativeSelectOption>
                                                <NativeSelectOption value="In Progress">In Progress</NativeSelectOption>
                                                <NativeSelectOption value="Resolved">Resolved</NativeSelectOption>
                                                <NativeSelectOption value="Closed">Closed</NativeSelectOption>
                                            </NativeSelect>
                                        </Field>
                                    )}
                                </FormischField>

                                {/* Priority */}
                                <FormischField of={form} path={["priority"]}>
                                    {(field) => (
                                        <Field data-invalid={field.errors !== null}>
                                            <FieldLabel className="flex items-center gap-2 text-sm font-medium">
                                                <FlagIcon className="size-3.5 text-muted-foreground"/>
                                                Priority
                                            </FieldLabel>
                                            <NativeSelect
                                                value={field.input ?? "Normal"}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                className="h-8 w-full rounded-none text-xs"
                                            >
                                                <NativeSelectOption value="High">High</NativeSelectOption>
                                                <NativeSelectOption value="Normal">Normal</NativeSelectOption>
                                                <NativeSelectOption value="Low">Low</NativeSelectOption>
                                            </NativeSelect>
                                        </Field>
                                    )}
                                </FormischField>

                                {/* Start date */}
                                <FormischField of={form} path={["startDate"]}>
                                    {(field) => (
                                        <Field data-invalid={field.errors !== null}>
                                            <FieldLabel className="flex items-center gap-2 text-sm font-medium">
                                                <CalendarDaysIcon className="size-3.5 text-muted-foreground"/>
                                                Start date
                                            </FieldLabel>
                                            <Input
                                                {...field.props}
                                                type="date"
                                                value={field.input ?? ""}
                                                className="h-8 w-full rounded-none shadow-none text-xs"
                                            />
                                        </Field>
                                    )}
                                </FormischField>

                                {/* Due date */}
                                <FormischField of={form} path={["dueDate"]}>
                                    {(field) => (
                                        <Field data-invalid={field.errors !== null}>
                                            <FieldLabel className="flex items-center gap-2 text-sm font-medium">
                                                <CalendarDaysIcon className="size-3.5 text-muted-foreground"/>
                                                Due date
                                            </FieldLabel>
                                            <Input
                                                {...field.props}
                                                type="date"
                                                value={field.input ?? ""}
                                                className="h-8 w-full rounded-none shadow-none text-xs"
                                            />
                                        </Field>
                                    )}
                                </FormischField>

                                {/* Estimated */}
                                <FormischField of={form} path={["estimatedHours"]}>
                                    {(field) => (
                                        <Field data-invalid={field.errors !== null}>
                                            <FieldLabel className="flex items-center gap-2 text-sm font-medium">
                                                <ClockIcon className="size-3.5 text-muted-foreground"/>
                                                Estimated Hours
                                            </FieldLabel>
                                            <Input
                                                {...field.props}
                                                placeholder="e.g. 8h"
                                                value={field.input ?? ""}
                                                className="h-8 w-full rounded-none shadow-none text-xs"
                                            />
                                        </Field>
                                    )}
                                </FormischField>

                                {/* Actual Hours */}
                                <FormischField of={form} path={["actualHours"]}>
                                    {(field) => (
                                        <Field data-invalid={field.errors !== null}>
                                            <FieldLabel className="flex items-center gap-2 text-sm font-medium">
                                                <CheckCircle2Icon className="size-3.5 text-muted-foreground"/>
                                                Actual Hours
                                            </FieldLabel>
                                            <Input
                                                {...field.props}
                                                placeholder="e.g. 4h"
                                                value={field.input ?? ""}
                                                className="h-8 w-full rounded-none shadow-none text-xs"
                                            />
                                        </Field>
                                    )}
                                </FormischField>

                            </CardContent>
                        </Card>

                        {/* People Card */}
                        <Card className="rounded-none shadow-none">
                            <CardHeader className="border-b">
                                <CardTitle className="text-base font-semibold">People</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <FormischField of={form} path={["assignee"]}>
                                    {(field) => {
                                        const selectedUser = MOCK_USERS.find(u => u.id === (field.input ?? "unassigned")) ?? MOCK_USERS[0]

                                        return (
                                            <Field data-invalid={field.errors !== null}>
                                                <FieldLabel className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                                                    <UserIcon className="size-3.5 text-muted-foreground"/>
                                                    Assignee
                                                </FieldLabel>

                                                <div className="flex items-center gap-2">
                                                    <Avatar className="size-8 rounded-none border">
                                                        <AvatarFallback className="rounded-none text-xs">
                                                            {selectedUser.fallback}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <NativeSelect
                                                        value={field.input ?? "unassigned"}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        className="h-9 w-full rounded-none text-xs"
                                                    >
                                                        {MOCK_USERS.map((user) => (
                                                            <NativeSelectOption key={user.id} value={user.id}>
                                                                {user.name}
                                                            </NativeSelectOption>
                                                        ))}
                                                    </NativeSelect>
                                                </div>
                                            </Field>
                                        )
                                    }}
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
    )
}