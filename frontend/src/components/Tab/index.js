import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Đảm bảo import CSS

const TabComponent = () => {
    return (
        <Tabs>
            <TabList>
                <Tab>Order</Tab>
                <Tab>Feedback Input</Tab>
                <Tab>Visible & Share</Tab>
            </TabList>

            <TabPanel>
                <div>
                    <label>
                        <input type="checkbox" />
                        One question per page
                    </label>
                    <br />
                    <label>
                        <input type="checkbox" />
                        Show Question Numbers
                    </label>
                    <br />
                    <label>
                        Number of attempts:
                        <input type="number" />
                    </label>
                    <br />
                    <label>
                        Time Limit:
                        <input type="text" />
                    </label>
                </div>
            </TabPanel>
            <TabPanel>
                <div>
                    <label>
                        <input type="checkbox" />
                        Display this message if required is not answered
                    </label>
                    <br />
                    <label>
                        <input type="checkbox" />
                        Display score
                    </label>
                    <br />
                    <label>
                        Display previous input:
                        <input type="text" />
                    </label>
                </div>
            </TabPanel>
            <TabPanel>
                <div>
                    <label>
                        Link:
                        <input type="text" />
                    </label>
                    <br />
                    <label>
                        Visible to:
                        <select>
                            <option value="everyone">Everyone</option>
                            <option value="registered">Registered Users</option>
                        </select>
                    </label>
                </div>
            </TabPanel>
        </Tabs>
    );
};

export default TabComponent;