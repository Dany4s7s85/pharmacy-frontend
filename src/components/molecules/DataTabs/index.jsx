import React from 'react';

import {
  StyledTabs,
  Wrap,
  StyledTabList,
  TabBtn,
  StyledTab,
  StyledTabPanels,
  StyledTabPanel,
  TabListHolder,
} from './DataTabs.styles';

function DataTabs({ data, orientation, white }) {
  return (
    <>
      <StyledTabs orientation={orientation} white={white}>
        <TabListHolder>
          <Wrap>
            <StyledTabList>
              {data.map(
                (tab, index) =>
                  tab && (
                    <TabBtn key={index}>
                      <StyledTab>{tab.label}</StyledTab>
                    </TabBtn>
                  ),
              )}
            </StyledTabList>
          </Wrap>
        </TabListHolder>

        <StyledTabPanels>
          {data.map((tab, index) => tab && <StyledTabPanel key={index}>{tab.content}</StyledTabPanel>)}
        </StyledTabPanels>
      </StyledTabs>
    </>
  );
}

export default DataTabs;
