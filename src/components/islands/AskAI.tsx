import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { FaRobot, FaComments } from 'react-icons/fa';
import { SiOpenai } from 'react-icons/si';
import { trackButtonClick } from '@/utils/analytics';

interface AskAIButtonProps {
  className?: string;
  position?: 'navbar' | 'doc' | 'floating';
  provider?: 'chatgpt' | 'claude' | 'both';
}

/*
 * Ask AI island.
 *
 * The "both" mode opens a small popover with two provider choices. We treat the
 * popover as a real menu:
 *   - role="menu" on the list, role="menuitem" on each option
 *   - aria-haspopup / aria-expanded / aria-controls on the trigger
 *   - Escape closes and returns focus to the trigger
 *   - Outside pointerdown closes (does not steal focus)
 *   - First item is focused on open so keyboard users can act immediately
 *   - Arrow Down / Arrow Up cycle through menuitems
 *
 * For "chatgpt" / "claude" the button is a direct action (opens a new tab), so
 * we skip all the popover state.
 *
 * The page title is read from the rendered <article> heading, falling back to
 * document.title. We use a microtask + a resilient lookup instead of an
 * arbitrary setTimeout (the previous 100ms timer was racy on slow hydration).
 */
export default function AskAIButton({
  className = '',
  position = 'floating',
  provider = 'both',
}: AskAIButtonProps) {
  const [pageTitle, setPageTitle] = useState<string>('');
  const [open, setOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  // Extract title once on mount. We poll a couple of frames in case the
  // article heading hydrates after this island.
  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const read = () => {
      if (cancelled) return;
      const h1 = document.querySelector('article h1');
      const docTitle =
        h1?.textContent?.trim() ||
        document.title.replace(' | Suites', '').trim();
      if (docTitle) {
        setPageTitle(docTitle);
        return;
      }
      if (attempts++ < 5) requestAnimationFrame(read);
    };

    read();
    return () => {
      cancelled = true;
    };
  }, []);

  const buildPrompt = useCallback(() => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    return `I'm reading the Suites testing framework documentation, this is the page title "${pageTitle}", and the url is ${currentUrl}
    read the page and answer the following questions:`;
  }, [pageTitle]);

  const closeMenu = useCallback(
    (returnFocus = true) => {
      setOpen(false);
      if (returnFocus) {
        // Defer to next tick so React unmount-then-focus does not race.
        requestAnimationFrame(() => triggerRef.current?.focus());
      }
    },
    [],
  );

  const handleAskChatGPT = useCallback(() => {
    trackButtonClick('Ask AI - ChatGPT', position);
    const chatGPTUrl = `https://chat.openai.com/?model=gpt-4o&q=${encodeURIComponent(buildPrompt())}`;
    window.open(chatGPTUrl, '_blank', 'noopener,noreferrer');
    closeMenu();
  }, [buildPrompt, position, closeMenu]);

  const handleAskClaude = useCallback(() => {
    trackButtonClick('Ask AI - Claude', position);
    const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(buildPrompt())}`;
    window.open(claudeUrl, '_blank', 'noopener,noreferrer');
    closeMenu();
  }, [buildPrompt, position, closeMenu]);

  const handleClick = () => {
    if (provider === 'chatgpt') return handleAskChatGPT();
    if (provider === 'claude') return handleAskClaude();
    setOpen((v) => !v);
  };

  // Escape + outside click close. Focus first menuitem on open.
  useEffect(() => {
    if (!open) return;

    const focusFirst = () => {
      const first = menuRef.current?.querySelector<HTMLButtonElement>(
        '[role="menuitem"]',
      );
      first?.focus();
    };
    requestAnimationFrame(focusFirst);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeMenu();
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const items = Array.from(
          menuRef.current?.querySelectorAll<HTMLButtonElement>(
            '[role="menuitem"]',
          ) ?? [],
        );
        if (items.length === 0) return;
        const idx = items.indexOf(document.activeElement as HTMLButtonElement);
        const next =
          e.key === 'ArrowDown'
            ? items[(idx + 1) % items.length]
            : items[(idx - 1 + items.length) % items.length];
        e.preventDefault();
        next?.focus();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (
        target &&
        !menuRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        // Outside click: close without stealing focus back to the trigger.
        closeMenu(false);
      }
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, closeMenu]);

  const showMenu = provider === 'both' && open;
  const menuVisuallyAvailable = provider === 'both';

  const buttonContent = (
    <>
      <FaRobot aria-hidden="true" />
      <span>Ask AI</span>
    </>
  );

  const triggerProps = {
    ref: triggerRef,
    className,
    onClick: handleClick,
    'aria-label': 'Ask AI about this page',
    title: 'Ask AI about this documentation page',
    type: 'button' as const,
    ...(menuVisuallyAvailable
      ? {
          'aria-haspopup': 'menu' as const,
          'aria-expanded': open,
          'aria-controls': menuId,
        }
      : {}),
  };

  const renderMenu = (variant: 'floating' | 'inline') => (
    <div
      ref={menuRef}
      id={menuId}
      role="menu"
      aria-label="Choose an AI assistant"
      data-role={
        variant === 'floating' ? 'options-menu' : 'options-menu-inline'
      }
      className="ask-ai-menu"
      data-variant={variant}
    >
      <button
        type="button"
        role="menuitem"
        className="ask-ai-menu-item"
        onClick={handleAskChatGPT}
      >
        <SiOpenai aria-hidden="true" />
        <span>ChatGPT</span>
      </button>
      <button
        type="button"
        role="menuitem"
        className="ask-ai-menu-item"
        onClick={handleAskClaude}
      >
        <FaComments aria-hidden="true" />
        <span>Claude</span>
      </button>
    </div>
  );

  if (position === 'floating') {
    return (
      <div className="ask-ai-root" data-position="floating">
        <button {...triggerProps} data-position="floating">
          {buttonContent}
        </button>
        {showMenu && renderMenu('floating')}
      </div>
    );
  }

  return (
    <div className="ask-ai-root" data-position={position}>
      <button {...triggerProps} data-position={position}>
        {buttonContent}
      </button>
      {showMenu && renderMenu('inline')}
    </div>
  );
}
