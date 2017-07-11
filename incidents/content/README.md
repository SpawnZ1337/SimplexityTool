
## Applications/Content

This folder contains all and only the content that is loaded into the different boxes
on the applications tool (apart from this README.md).

#### How are the files loaded into the boxes?

When the tool is loading HTML files to input for the content boxes, the script first looks if
there is content in the HTML file being loaded in the specific folder
for the game that has been selected in the dropdownlist.
When there isn't any content in it,
it will try to get the content from the HTML file in this 'content' folder.

These placeholders are used to fill in the dates or the content
that the moderator has filled into the form fields called 'details of new user' at the top of the page of the page.
The following placeholders are being used:
* **{game-name}** - The name of the game, selected in the first dropdownlist
* **{forum-name}** - The forum name of the new trialist, filled into the corresponding text box
* **{ingame-name}** - The ingame name for specific games, filled into the corresponding text box
* **{hots-region}** - The region in Heroes of the Storm, selected in the corresponding dropdownlist
* **{lol-region}** - The region in League of Legends, selected in the corresponding dropdownlist
* **{overwatch-region}** - The region in Overwatch, selected in the corresponding dropdownlist
* **{ts-id}** - The TeamSpeak ID of the new trialist, filled into the corresponding text box
* **{link-application}** - The link to the application thread, filled into the corresponding text box
* **{start-trial-date-short}** - The start date of the trial in dd/mm/yyyy
* **{end-trial-date-short}** - The end date of the trail in dd/mm/yyyy
* **{start-trial-date-long}** - The start date of the trial in [day] [full month name]
* **{end-trial-date-long}** - The end date of the trial in [day] [full month name]
