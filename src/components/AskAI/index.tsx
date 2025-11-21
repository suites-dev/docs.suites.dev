import React, { useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import { FaRobot, FaComments } from 'react-icons/fa';
import { SiOpenai } from 'react-icons/si';
import styles from './styles.module.css';

interface AskAIButtonProps {
  className?: string;
  position?: 'navbar' | 'doc' | 'floating';
  provider?: 'chatgpt' | 'claude' | 'both';
}

export default function AskAIButton({
  className = '',
  position = 'floating',
  provider = 'both'
}: AskAIButtonProps) {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState<string>('');
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    // Extract page content and metadata
    const extractPageInfo = () => {
      // Get the page title from document or h1
      const h1Element = document.querySelector('article h1');
      const docTitle = h1Element?.textContent || document.title.replace(' | Suites', '');
      setPageTitle(docTitle);
    };

    // Wait for content to load
    setTimeout(extractPageInfo, 100);
  }, [location.pathname]);

  const buildPrompt = () => {
    const currentUrl = window.location.href;

    // Build a concise, effective prompt
    return `I'm reading the Suites testing framework documentation, this is the page title "${pageTitle}", and the url is ${currentUrl}
    read the page and answer the following questions:`;
  };

  const handleAskChatGPT = () => {
    const prompt = buildPrompt();
    // ChatGPT supports the q parameter with optional model selection
    const chatGPTUrl = `https://chat.openai.com/?model=gpt-4o&q=${encodeURIComponent(prompt)}`;
    window.open(chatGPTUrl, '_blank');
    setShowOptions(false);
  };

  const handleAskClaude = () => {
    const prompt = buildPrompt();
    // Claude uses the q parameter on the /new endpoint
    const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
    window.open(claudeUrl, '_blank');
    setShowOptions(false);
  };

  const handleClick = () => {
    if (provider === 'chatgpt') {
      handleAskChatGPT();
    } else if (provider === 'claude') {
      handleAskClaude();
    } else {
      setShowOptions(!showOptions);
    }
  };

  const buttonContent = (
    <>
      <FaRobot className={styles.icon} />
      <span className={styles.text}>Ask AI</span>
    </>
  );

  if (position === 'floating') {
    return (
      <div className={styles.askAIContainer}>
        <button
          className={`${styles.askAIButtonFloating} ${className}`}
          onClick={handleClick}
          aria-label="Ask AI about this page"
          title="Ask AI about this documentation page"
        >
          {buttonContent}
        </button>

        {provider === 'both' && showOptions && (
          <div className={styles.optionsMenu}>
            <button
              className={styles.optionButton}
              onClick={handleAskChatGPT}
              title="Ask ChatGPT"
            >
              <SiOpenai className={styles.optionIcon} />
              <span>ChatGPT</span>
            </button>
            <button
              className={styles.optionButton}
              onClick={handleAskClaude}
              title="Ask Claude"
            >
              <FaComments className={styles.optionIcon} />
              <span>Claude</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.askAIContainer}>
      <button
        className={`${styles.askAIButton} ${styles[position]} ${className}`}
        onClick={handleClick}
        aria-label="Ask AI about this page"
        title="Ask AI about this documentation page"
      >
        {buttonContent}
      </button>

      {provider === 'both' && showOptions && (
        <div className={styles.optionsMenuInline}>
          <button
            className={styles.optionButton}
            onClick={handleAskChatGPT}
            title="Ask ChatGPT"
          >
            <SiOpenai className={styles.optionIcon} />
            <span>ChatGPT</span>
          </button>
          <button
            className={styles.optionButton}
            onClick={handleAskClaude}
            title="Ask Claude"
          >
            <FaComments className={styles.optionIcon} />
            <span>Claude</span>
          </button>
        </div>
      )}
    </div>
  );
}