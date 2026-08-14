import {CodeHighlightNode, CodeNode} from "@lexical/code";
import {
    AutoFocusExtension,
    ClearEditorExtension,
    DecoratorTextExtension,
    HorizontalRuleExtension,
    SelectionAlwaysOnDisplayExtension
} from "@lexical/extension";
import {HistoryExtension} from "@lexical/history";
import {AutoLinkExtension, ClickableLinkExtension, LinkExtension} from "@lexical/link";
import {CheckListExtension, ListExtension} from "@lexical/list";
import {
    CHECK_LIST,
    ELEMENT_TRANSFORMERS,
    MULTILINE_ELEMENT_TRANSFORMERS,
    TEXT_FORMAT_TRANSFORMERS,
    TEXT_MATCH_TRANSFORMERS
} from "@lexical/markdown";
import {OverflowNode} from "@lexical/overflow";
import {CharacterLimitPlugin} from "@lexical/react/LexicalCharacterLimitPlugin";
import {LexicalExtensionComposer} from "@lexical/react/LexicalExtensionComposer";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import {TabIndentationPlugin} from "@lexical/react/LexicalTabIndentationPlugin";
import {TablePlugin} from "@lexical/react/LexicalTablePlugin";
import {RichTextExtension} from "@lexical/rich-text";
import {TableCellNode, TableNode, TableRowNode} from "@lexical/table";
import {type EditorState, type SerializedEditorState, configExtension, defineExtension} from "lexical";
import {useMemo, useState} from "react";

import {ContentEditable} from "@/components/editor/editor-ui/content-editable";
import {DateTimeExtension} from "@/components/editor/extensions/date-time-extension";
import {EmojisExtension} from "@/components/editor/extensions/emojis-extension";
import {ImagesExtension} from "@/components/editor/extensions/images-extension";
import {MarkdownShortcutsExtension} from "@/components/editor/extensions/markdown-shortcuts-extension";
import {MaxLengthExtension} from "@/components/editor/extensions/max-length-extension";
import {AutocompleteNode} from "@/components/editor/nodes/autocomplete-node";
import {TweetNode} from "@/components/editor/nodes/embeds/tweet-node";
import {YouTubeNode} from "@/components/editor/nodes/embeds/youtube-node";
import {EmojiNode} from "@/components/editor/nodes/emoji-node";
import {LayoutContainerNode} from "@/components/editor/nodes/layout-container-node";
import {LayoutItemNode} from "@/components/editor/nodes/layout-item-node";
import {MentionNode} from "@/components/editor/nodes/mention-node";
import {SpecialTextNode} from "@/components/editor/nodes/special-text-node";

import {ActionsPlugin} from "@/components/editor/plugins/actions/actions-plugin";
import {ClearEditorActionPlugin} from "@/components/editor/plugins/actions/clear-editor-plugin";
import {CounterCharacterPlugin} from "@/components/editor/plugins/actions/counter-character-plugin";
import {EditModeTogglePlugin} from "@/components/editor/plugins/actions/edit-mode-toggle-plugin";
import {ImportExportPlugin} from "@/components/editor/plugins/actions/import-export-plugin";
import {MarkdownTogglePlugin} from "@/components/editor/plugins/actions/markdown-toggle-plugin";
import {ShareContentPlugin} from "@/components/editor/plugins/actions/share-content-plugin";
import {SpeechToTextPlugin} from "@/components/editor/plugins/actions/speech-to-text-plugin";
import {TreeViewPlugin} from "@/components/editor/plugins/actions/tree-view-plugin";
import {AutoCompletePlugin} from "@/components/editor/plugins/auto-complete-plugin";
import {CodeActionMenuPlugin} from "@/components/editor/plugins/code-action-menu-plugin";
import {CodeHighlightPlugin} from "@/components/editor/plugins/code-highlight-plugin";
import {ComponentPickerMenuPlugin} from "@/components/editor/plugins/component-picker-menu-plugin";
import {ContextMenuPlugin} from "@/components/editor/plugins/context-menu-plugin";
import {DraggableBlockPlugin} from "@/components/editor/plugins/draggable-block-plugin";
import {AutoEmbedPlugin} from "@/components/editor/plugins/embeds/auto-embed-plugin";
import {TwitterPlugin} from "@/components/editor/plugins/embeds/twitter-plugin";
import {YouTubePlugin} from "@/components/editor/plugins/embeds/youtube-plugin";
import {EmojiPickerPlugin} from "@/components/editor/plugins/emoji-picker-plugin";
import {FloatingLinkEditorPlugin} from "@/components/editor/plugins/floating-link-editor-plugin";
import {FloatingTextFormatToolbarPlugin} from "@/components/editor/plugins/floating-text-format-plugin";
import {LayoutPlugin} from "@/components/editor/plugins/layout-plugin";
import {MentionsPlugin} from "@/components/editor/plugins/mentions-plugin";
import {AlignmentPickerPlugin} from "@/components/editor/plugins/picker/alignment-picker-plugin";
import {BulletedListPickerPlugin} from "@/components/editor/plugins/picker/bulleted-list-picker-plugin";
import {CheckListPickerPlugin} from "@/components/editor/plugins/picker/check-list-picker-plugin";
import {CodePickerPlugin} from "@/components/editor/plugins/picker/code-picker-plugin";
import {ColumnsLayoutPickerPlugin} from "@/components/editor/plugins/picker/columns-layout-picker-plugin";
import {DateTimePickerPlugin} from "@/components/editor/plugins/picker/date-time-picker-plugin";
import {DividerPickerPlugin} from "@/components/editor/plugins/picker/divider-picker-plugin";
import {EmbedsPickerPlugin} from "@/components/editor/plugins/picker/embeds-picker-plugin";
import {HeadingPickerPlugin} from "@/components/editor/plugins/picker/heading-picker-plugin";
import {ImagePickerPlugin} from "@/components/editor/plugins/picker/image-picker-plugin";
import {NumberedListPickerPlugin} from "@/components/editor/plugins/picker/numbered-list-picker-plugin";
import {ParagraphPickerPlugin} from "@/components/editor/plugins/picker/paragraph-picker-plugin";
import {QuotePickerPlugin} from "@/components/editor/plugins/picker/quote-picker-plugin";
import {DynamicTablePickerPlugin, TablePickerPlugin} from "@/components/editor/plugins/picker/table-picker-plugin";
import {SpecialTextPlugin} from "@/components/editor/plugins/special-text-plugin";
import {TabFocusPlugin} from "@/components/editor/plugins/tab-focus-plugin";
import {BlockFormatDropDown} from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import {FormatBulletedList} from "@/components/editor/plugins/toolbar/block-format/format-bulleted-list";
import {FormatCheckList} from "@/components/editor/plugins/toolbar/block-format/format-check-list";
import {FormatCodeBlock} from "@/components/editor/plugins/toolbar/block-format/format-code-block";
import {FormatHeading} from "@/components/editor/plugins/toolbar/block-format/format-heading";
import {FormatNumberedList} from "@/components/editor/plugins/toolbar/block-format/format-numbered-list";
import {FormatParagraph} from "@/components/editor/plugins/toolbar/block-format/format-paragraph";
import {FormatQuote} from "@/components/editor/plugins/toolbar/block-format/format-quote";
import {BlockInsertPlugin} from "@/components/editor/plugins/toolbar/block-insert-plugin";
import {InsertColumnsLayout} from "@/components/editor/plugins/toolbar/block-insert/insert-columns-layout";
import {InsertEmbeds} from "@/components/editor/plugins/toolbar/block-insert/insert-embeds";
import {InsertHorizontalRule} from "@/components/editor/plugins/toolbar/block-insert/insert-horizontal-rule";
import {InsertImage} from "@/components/editor/plugins/toolbar/block-insert/insert-image";
import {InsertTable} from "@/components/editor/plugins/toolbar/block-insert/insert-table";
import {ClearFormattingToolbarPlugin} from "@/components/editor/plugins/toolbar/clear-formatting-toolbar-plugin";
import {CodeLanguageToolbarPlugin} from "@/components/editor/plugins/toolbar/code-language-toolbar-plugin";
import {ElementFormatToolbarPlugin} from "@/components/editor/plugins/toolbar/element-format-toolbar-plugin";
import {FontBackgroundToolbarPlugin} from "@/components/editor/plugins/toolbar/font-background-toolbar-plugin";
import {FontColorToolbarPlugin} from "@/components/editor/plugins/toolbar/font-color-toolbar-plugin";
import {FontFamilyToolbarPlugin} from "@/components/editor/plugins/toolbar/font-family-toolbar-plugin";
import {FontFormatToolbarPlugin} from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin";
import {FontSizeToolbarPlugin} from "@/components/editor/plugins/toolbar/font-size-toolbar-plugin";
import {HistoryToolbarPlugin} from "@/components/editor/plugins/toolbar/history-toolbar-plugin";
import {LinkToolbarPlugin} from "@/components/editor/plugins/toolbar/link-toolbar-plugin";
import {SubSuperToolbarPlugin} from "@/components/editor/plugins/toolbar/subsuper-toolbar-plugin";
import {ToolbarPlugin} from "@/components/editor/plugins/toolbar/toolbar-plugin";
import {editorTheme} from "@/components/editor/themes/editor-theme";
import {EMOJI} from "@/components/editor/transformers/markdown-emoji-transformer";
import {HR} from "@/components/editor/transformers/markdown-hr-transformer";
import {IMAGE} from "@/components/editor/transformers/markdown-image-transformer";
import {TABLE} from "@/components/editor/transformers/markdown-table-transformer";
import {TWEET} from "@/components/editor/transformers/markdown-tweet-transformer";
import {validateUrl} from "@/components/editor/utils/url";
import {Separator} from "@/components/ui/separator";
import {TooltipProvider} from "@/components/ui/tooltip";

const placeholder = "Press / for commands...";

interface EditorProps {
    editorState?: EditorState;
    editorSerializedState?: SerializedEditorState;
    onChange?: (editorState: EditorState) => void;
    onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
    maxLength?: number;

    // Granular Toolbar & Feature Toggles (Disabled by default)
    enableFontFamily?: boolean;
    enableFontSize?: boolean;
    enableFontColor?: boolean;
    enableFontBackground?: boolean;

    enableHorizontalRule?: boolean;
    enableImage?: boolean;
    enableTable?: boolean;
    enableColumnsLayout?: boolean;

    enableTwitter?: boolean;
    enableYouTube?: boolean;

    enableDateTime?: boolean;
    enableAutoComplete?: boolean;
    enableSpecialText?: boolean;

    enableSpeechToText?: boolean;
    enableShare?: boolean;
    enableImportExport?: boolean;
    enableTreeView?: boolean;
}

export function Editor({
                           editorState,
                           editorSerializedState,
                           onChange,
                           onSerializedChange,
                           maxLength,
                           enableFontFamily = false,
                           enableFontSize = false,
                           enableFontColor = false,
                           enableFontBackground = false,
                           enableHorizontalRule = false,
                           enableImage = false,
                           enableTable = false,
                           enableColumnsLayout = false,
                           enableTwitter = false,
                           enableYouTube = false,
                           enableDateTime = false,
                           enableAutoComplete = false,
                           enableSpecialText = false,
                           enableSpeechToText = false,
                           enableShare = false,
                           enableImportExport = false,
                           enableTreeView = false,
                       }: EditorProps) {
    const [floatingAnchorElem, setFloatingAnchorElem] =
        useState<HTMLDivElement | null>(null);
    const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };

    const markdownTransformers = useMemo(() => [
        ...(enableTable ? [TABLE] : []),
        ...(enableHorizontalRule ? [HR] : []),
        ...(enableImage ? [IMAGE] : []),
        ...(enableTwitter ? [TWEET] : []),
        EMOJI,
        CHECK_LIST,
        ...ELEMENT_TRANSFORMERS,
        ...MULTILINE_ELEMENT_TRANSFORMERS,
        ...TEXT_FORMAT_TRANSFORMERS,
        ...TEXT_MATCH_TRANSFORMERS,
    ], [enableTable, enableHorizontalRule, enableImage, enableTwitter]);

    const pickerBaseOptions = useMemo(() => [
        ParagraphPickerPlugin(),
        HeadingPickerPlugin({n: 1}),
        HeadingPickerPlugin({n: 2}),
        HeadingPickerPlugin({n: 3}),
        CheckListPickerPlugin(),
        NumberedListPickerPlugin(),
        BulletedListPickerPlugin(),
        QuotePickerPlugin(),
        CodePickerPlugin(),
        AlignmentPickerPlugin({alignment: "left"}),
        AlignmentPickerPlugin({alignment: "center"}),
        AlignmentPickerPlugin({alignment: "right"}),
        AlignmentPickerPlugin({alignment: "justify"}),
        ...(enableTable ? [TablePickerPlugin()] : []),
        ...(enableHorizontalRule ? [DividerPickerPlugin()] : []),
        ...(enableImage ? [ImagePickerPlugin()] : []),
        ...(enableTwitter ? [EmbedsPickerPlugin({embed: "tweet"})] : []),
        ...(enableYouTube ? [EmbedsPickerPlugin({embed: "youtube-video"})] : []),
        ...(enableColumnsLayout ? [ColumnsLayoutPickerPlugin()] : []),
        ...(enableDateTime ? [DateTimePickerPlugin()] : []),
    ], [
        enableTable,
        enableHorizontalRule,
        enableImage,
        enableTwitter,
        enableYouTube,
        enableColumnsLayout,
        enableDateTime,
    ]);

    const AppExtension = useMemo(
        () =>
            defineExtension({
                dependencies: [
                    RichTextExtension,
                    AutoFocusExtension,
                    SelectionAlwaysOnDisplayExtension,
                    HistoryExtension,
                    configExtension(LinkExtension, {
                        validateUrl,
                        attributes: {rel: "noopener noreferrer", target: "_blank"},
                    }),
                    AutoLinkExtension,
                    ClickableLinkExtension,
                    configExtension(MaxLengthExtension, {
                        disabled: maxLength === undefined,
                        maxLength: maxLength ?? 0,
                    }),
                    configExtension(MarkdownShortcutsExtension, {
                        transformers: markdownTransformers,
                    }),
                    ClearEditorExtension,
                    EmojisExtension,
                    DecoratorTextExtension,
                    configExtension(ListExtension, {shouldPreserveNumbering: true}),
                    CheckListExtension,
                    ...(enableHorizontalRule ? [HorizontalRuleExtension] : []),
                    ...(enableImage ? [ImagesExtension] : []),
                    ...(enableDateTime ? [DateTimeExtension] : []),
                ],
                name: "@shadcn-editor",
                namespace: "Playground",
                nodes: [
                    OverflowNode,
                    EmojiNode,
                    MentionNode,
                    CodeNode,
                    CodeHighlightNode,
                    ...(enableTable ? [TableNode, TableCellNode, TableRowNode] : []),
                    ...(enableAutoComplete ? [AutocompleteNode] : []),
                    ...(enableSpecialText ? [SpecialTextNode] : []),
                    ...(enableColumnsLayout ? [LayoutContainerNode, LayoutItemNode] : []),
                    ...(enableTwitter ? [TweetNode] : []),
                    ...(enableYouTube ? [YouTubeNode] : []),
                ],
                $initialEditorState(editor) {
                    if (editorSerializedState) {
                        editor.parseEditorState(editorSerializedState);
                    } else if (editorState) {
                        editor.setEditorState(editorState);
                    }
                },
                theme: editorTheme,
            }),
        [
            editorState,
            editorSerializedState,
            maxLength,
            markdownTransformers,
            enableHorizontalRule,
            enableImage,
            enableDateTime,
            enableTable,
            enableAutoComplete,
            enableSpecialText,
            enableColumnsLayout,
            enableTwitter,
            enableYouTube,
        ],
    );

    const hasBlockInserts =
        enableHorizontalRule ||
        enableImage ||
        enableTable ||
        enableColumnsLayout ||
        enableTwitter ||
        enableYouTube;

    return (
        <div className="bg-background overflow-hidden rounded-lg border shadow w-full">
            <LexicalExtensionComposer extension={AppExtension} contentEditable={null}>
                <TooltipProvider>
                    <div className="relative">
                        <ToolbarPlugin>
                            {({blockType}) => (
                                <div
                                    className="vertical-align-middle sticky top-0 z-10 flex items-center gap-2 overflow-auto border-b p-1">
                                    <HistoryToolbarPlugin/>
                                    <Separator orientation="vertical" className="h-7!"/>
                                    <BlockFormatDropDown>
                                        <FormatParagraph/>
                                        <FormatHeading levels={["h1", "h2", "h3"]}/>
                                        <FormatNumberedList/>
                                        <FormatBulletedList/>
                                        <FormatCheckList/>
                                        <FormatCodeBlock/>
                                        <FormatQuote/>
                                    </BlockFormatDropDown>
                                    {blockType === "code" ? (
                                        <CodeLanguageToolbarPlugin/>
                                    ) : (
                                        <>
                                            {enableFontFamily && <FontFamilyToolbarPlugin/>}
                                            {enableFontSize && (
                                                <>
                                                    <Separator orientation="vertical" className="h-7!"/>
                                                    <FontSizeToolbarPlugin/>
                                                </>
                                            )}

                                            <FontFormatToolbarPlugin/>
                                            <SubSuperToolbarPlugin/>
                                            <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode}/>
                                            <ClearFormattingToolbarPlugin/>

                                            {enableFontColor && <FontColorToolbarPlugin/>}
                                            {enableFontBackground && <FontBackgroundToolbarPlugin/>}

                                            <ElementFormatToolbarPlugin/>

                                            {hasBlockInserts && (
                                                <BlockInsertPlugin>
                                                    {enableHorizontalRule && <InsertHorizontalRule/>}
                                                    {enableImage && <InsertImage/>}
                                                    {enableTable && <InsertTable/>}
                                                    {enableColumnsLayout && <InsertColumnsLayout/>}
                                                    {(enableTwitter || enableYouTube) && <InsertEmbeds/>}
                                                </BlockInsertPlugin>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </ToolbarPlugin>
                        <div className="relative">
                            <div className="">
                                <div className="" ref={onRef}>
                                    <ContentEditable
                                        placeholder={placeholder}
                                        className="h-[calc(100vh-141px)] overflow-y-auto pl-4"
                                    />
                                </div>
                            </div>

                            <ComponentPickerMenuPlugin
                                baseOptions={pickerBaseOptions}
                                dynamicOptionsFn={DynamicTablePickerPlugin}
                            />

                            <EmojiPickerPlugin/>
                            <MentionsPlugin/>
                            <ContextMenuPlugin/>
                            <TabFocusPlugin/>
                            <TabIndentationPlugin/>
                            <CodeHighlightPlugin/>

                            {/* Granular Plugins */}
                            {enableTable && <TablePlugin/>}
                            {enableAutoComplete && <AutoCompletePlugin/>}
                            {enableSpecialText && <SpecialTextPlugin/>}
                            {enableColumnsLayout && <LayoutPlugin/>}
                            {enableTwitter && <TwitterPlugin/>}
                            {enableYouTube && <YouTubePlugin/>}
                            {(enableTwitter || enableYouTube) && <AutoEmbedPlugin/>}

                            <DraggableBlockPlugin
                                anchorElem={floatingAnchorElem}
                                baseOptions={pickerBaseOptions}
                                dynamicOptionsFn={DynamicTablePickerPlugin}
                            />

                            <FloatingTextFormatToolbarPlugin
                                anchorElem={floatingAnchorElem}
                                setIsLinkEditMode={setIsLinkEditMode}
                            />
                            <FloatingLinkEditorPlugin
                                anchorElem={floatingAnchorElem}
                                isLinkEditMode={isLinkEditMode}
                                setIsLinkEditMode={setIsLinkEditMode}
                            />
                            <CodeActionMenuPlugin anchorElem={floatingAnchorElem}/>
                        </div>

                        <ActionsPlugin>
                            <div
                                className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
                                <div className="flex flex-1 justify-start text-xs text-gray-500">
                                    {maxLength !== undefined && (
                                        <CharacterLimitPlugin maxLength={maxLength} charset="UTF-16"/>
                                    )}
                                </div>
                                <div>
                                    <CounterCharacterPlugin charset="UTF-16"/>
                                </div>
                                <div className="flex flex-1 justify-end">
                                    <MarkdownTogglePlugin
                                        shouldPreserveNewLinesInMarkdown={true}
                                        transformers={markdownTransformers}
                                    />
                                    <EditModeTogglePlugin/>
                                    <ClearEditorActionPlugin/>

                                    {/* Granular Action Buttons */}
                                    {enableSpeechToText && <SpeechToTextPlugin/>}
                                    {enableShare && <ShareContentPlugin/>}
                                    {enableImportExport && <ImportExportPlugin/>}
                                    {enableTreeView && <TreeViewPlugin/>}
                                </div>
                            </div>
                        </ActionsPlugin>
                    </div>

                    <OnChangePlugin
                        ignoreSelectionChange={true}
                        onChange={(editorState) => {
                            onChange?.(editorState);
                            onSerializedChange?.(editorState.toJSON());
                        }}
                    />
                </TooltipProvider>
            </LexicalExtensionComposer>
        </div>
    );
}