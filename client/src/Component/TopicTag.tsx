interface TopicTagProps {
  label: string;
}

const TopicTag: React.FC<TopicTagProps> = ({ label }) => {
  return (
    <span
      style={{
        backgroundColor: "#3C3C3C",
        color: "#FFFFFF",
        padding: "5px 10px",
        borderRadius: "15px",
        fontSize: "14px",
        marginRight: "8px",
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
};
export default TopicTag;
