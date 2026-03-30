import Link from "next/link";

const mockConversations = [
  {
    matchId: "1",
    partnerName: "Margaret",
    partnerInitials: "MW",
    lastMessage: "That sounds wonderful! I'd love to join you for a morning walk.",
    lastMessageTime: "2 min ago",
    unread: true,
  },
  {
    matchId: "2",
    partnerName: "Robert",
    partnerInitials: "RJ",
    lastMessage: "Looking forward to our session on Thursday!",
    lastMessageTime: "Yesterday",
    unread: false,
  },
  {
    matchId: "3",
    partnerName: "Dorothy",
    partnerInitials: "DL",
    lastMessage: "The birdwatching at Riparian was amazing this morning.",
    lastMessageTime: "2 days ago",
    unread: false,
  },
];

export default function MessagesPage() {
  return (
    <div
      style={{
        fontFamily: "'Lexend', sans-serif",
        color: "#173124",
        padding: "2.5rem",
        maxWidth: "720px",
      }}
    >
      <h1
        style={{
          fontFamily: "'Epilogue', serif",
          fontWeight: 800,
          fontSize: "2.25rem",
          color: "#173124",
          letterSpacing: "-0.02em",
          marginBottom: "2rem",
        }}
      >
        Messages
      </h1>

      {mockConversations.length === 0 ? (
        <div
          style={{
            backgroundColor: "#E7E2D7",
            border: "2px solid #C2C8C2",
            borderRadius: "2rem",
            padding: "3rem 2rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Epilogue', serif",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "#173124",
              marginBottom: "0.75rem",
            }}
          >
            No messages yet
          </p>
          <p style={{ fontSize: "1.0625rem", color: "#727973", marginBottom: "1.5rem" }}>
            When you connect with a match, your conversations will appear here.
          </p>
          <Link
            href="/match"
            style={{
              display: "inline-block",
              backgroundColor: "#173124",
              color: "#FFFFFF",
              fontWeight: 600,
              padding: "0.875rem 1.75rem",
              borderRadius: "3rem",
              fontSize: "1rem",
              textDecoration: "none",
              minHeight: "48px",
            }}
          >
            View My Matches
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {mockConversations.map((conv) => (
            <Link
              key={conv.matchId}
              href={`/messages/${conv.matchId}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                backgroundColor: "#E7E2D7",
                border: conv.unread ? "2px solid #735C00" : "2px solid #C2C8C2",
                borderLeft: conv.unread ? "4px solid #735C00" : "2px solid #C2C8C2",
                borderRadius: "1.5rem",
                padding: "1.25rem 1.5rem",
                textDecoration: "none",
                color: "#173124",
                minHeight: "72px",
                transition: "background-color 0.15s",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  backgroundColor: "#173124",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Epilogue', serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  flexShrink: 0,
                }}
              >
                {conv.partnerInitials}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "'Epilogue', serif",
                    fontWeight: conv.unread ? 700 : 600,
                    fontSize: "1.125rem",
                    color: "#173124",
                    marginBottom: "0.2rem",
                  }}
                >
                  {conv.partnerName}
                </p>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: conv.unread ? "#173124" : "#727973",
                    fontWeight: conv.unread ? 600 : 400,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {conv.lastMessage}
                </p>
              </div>

              {/* Time */}
              <div style={{ flexShrink: 0, textAlign: "right" }}>
                <p style={{ fontSize: "0.8rem", color: "#727973" }}>{conv.lastMessageTime}</p>
                {conv.unread && (
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#735C00",
                      marginLeft: "auto",
                      marginTop: "0.375rem",
                    }}
                  />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
