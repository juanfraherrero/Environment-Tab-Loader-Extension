interface TabsForEnvironmentSectionProps {
  newPageUrl: string;
  setNewPageUrl: (url: string) => void;
  handleAddPage: () => void;
  pages: string[];
}

const TabsForEnvironmentSection: React.FC<TabsForEnvironmentSectionProps> = ({
  newPageUrl,
  setNewPageUrl,
  handleAddPage,
  pages,
}) => {
  return (
    <div className="sections tabsForEnv">
      <h3>Tabs for the selected environment</h3>
      <input
        type="text"
        id="newPageUrl"
        placeholder="URL of new tab"
        value={newPageUrl}
        onChange={(e) => { console.log(pages); setNewPageUrl(e.target.value) }}
      />
      <button onClick={handleAddPage}>Add tab</button>

      <ul id="pagesList">
        {pages.map((page, idx) => {
          console.log(page);
          return <li key={idx}>{page}</li>
        }
        )}
      </ul>
    </div >
  );
};

export default TabsForEnvironmentSection;
