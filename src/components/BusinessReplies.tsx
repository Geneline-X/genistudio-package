/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useMemo, useContext } from 'react';
import { motion } from 'framer-motion';
import { Building2, Loader2, InboxIcon } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ChatContext } from './ChatContext';

interface BusinessRepliesProps {
  chatbotId: string;
  chatbotUserId: string;
  theme: any;
}

const BusinessReplies: React.FC<BusinessRepliesProps> = ({ chatbotUserId, theme }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { email } = useContext(ChatContext);

  const fetchBusinessReplies = async ({ pageParam = undefined }) => {
    if (!email) {
      throw new Error('Email is required');
    }
    const res = await fetch(`/api/getbusinessreply?email=${email}&cursor=${pageParam || ''}&limit=20`);
    if (!res.ok) throw new Error('Failed to fetch business replies');
    return res.json();
  };

  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status,
    //@ts-ignore
  } = useInfiniteQuery({
    queryKey: ['businessReplies', chatbotUserId, email],
    queryFn: fetchBusinessReplies,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!email,
  });

  const replies = useMemo(() => data?.pages.flatMap(page => page.replies) || [], [data]);

  useEffect(() => {
    scrollToBottom();
  }, [replies]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRadius: '0.5rem',
    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    padding: '1rem',
    backgroundColor: theme.backgroundColor,
  };

  const messageListStyle: React.CSSProperties = {
    flexGrow: 1,
    overflowY: 'auto',
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  const messageBubbleStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    backgroundColor: theme.primaryColor,
  };

  const messageHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem',
  };

  const messageTextStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '1.125rem',
  };

  const messageTimestampStyle: React.CSSProperties = {
    opacity: 0.75,
    marginTop: '0.5rem',
    display: 'block',
    textAlign: 'center',
    fontSize: '0.875rem',
  };

  const loadMoreButtonStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    transition: 'background-color 0.3s ease',
    backgroundColor: isFetchingNextPage ? theme.disabledColor : theme.primaryColor,
    color: theme.primaryTextColor,
    cursor: isFetchingNextPage ? 'not-allowed' : 'pointer',
  };

  const spinnerStyle: React.CSSProperties = {
    height: '2rem',
    width: '2rem',
    animation: 'spin 1s linear infinite',
    color: theme.theme.primaryColor,
  };

  const smallSpinnerStyle: React.CSSProperties = {
    width: '1rem',
    height: '1rem',
    animation: 'spin 1s linear infinite',
    color: theme.theme.primaryColor,
  };

  const emptyStateStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '2rem',
    color: theme.theme.secondaryTextColor,
    gap: '1rem',
  };

  if (!email) return <div style={{ textAlign: 'center', color: '#6B7280' }}>Email is required to fetch replies.</div>;
  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
      <Loader2 style={spinnerStyle} />
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
  if (status === 'error') return (
    <div style={emptyStateStyle}>
      <InboxIcon 
        style={{ 
          width: '3rem', 
          height: '3rem',
          color: theme.theme.primaryColor,
          opacity: 0.6
        }} 
      />
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ 
          fontSize: '1.2rem', 
          fontWeight: 600,
          marginBottom: '0.5rem',
          color: theme.theme.primaryColor
        }}>
          No Business Replies Yet
        </h3>
        <p style={{ 
          fontSize: '0.9rem',
          color: theme.theme.secondaryTextColor
        }}>
          When businesses respond to your messages, they'll appear here
        </p>
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={messageListStyle}>
        {replies.length === 0 ? (
          <div style={emptyStateStyle}>
            <InboxIcon 
              style={{ 
                width: '3rem', 
                height: '3rem',
                color: theme.theme.primaryColor,
                opacity: 0.6
              }} 
            />
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: theme.theme.primaryColor
              }}>
                No Business Replies Yet
              </h3>
              <p style={{ 
                fontSize: '0.9rem',
                color: theme.theme.secondaryTextColor
              }}>
                When businesses respond to your messages, they'll appear here
              </p>
            </div>
          </div>
        ) : (
          replies.map((reply, index) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              style={messageBubbleStyle}
            >
              <div style={messageHeaderStyle}>
                <Building2 style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                <span style={{ fontWeight: 600 }}>Business</span>
              </div>
              <p style={messageTextStyle}>{reply.text}</p>
              <small style={messageTimestampStyle}>
                {new Date(reply.timestamp).toLocaleString()}
              </small>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {hasNextPage && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={() => fetchNextPage()} 
            disabled={isFetchingNextPage}
            style={loadMoreButtonStyle}
          >
            {isFetchingNextPage ? (
              <Loader2 style={smallSpinnerStyle} />
            ) : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessReplies;