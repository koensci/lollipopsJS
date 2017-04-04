# lollipopsJS

A mutation lollipop diagram generator for easy use in web applications with the single file [lollipops.js](lollipopsJS/lollipops.js).
Protein domains are retrieved from the [Pfam API](http://pfam.xfam.org/help#tabview=tab9) and variants are annotated with lollipop markers. 

LollipopsJS is ideal to display a single individual's variants, such as in clinical applications for precision medicine.

## Usage

Add the [lollipops.js](lollipops.js) file to your project. No dependencies needed.

Draw with ```lollipopsJS.drawProtein()```. It requires the HTML canvas tag ID, the protein's Uniprot Accession 
number, an array of amino acid changes, and an array of corresponding lollipop colors.

![EGFR](EGFR.png?raw=true)
This [example diagram](http://cdn.rawgit.com/koensci/lollipopsJS/master/index.html) of an EGFR is generated as follows:

```
lollipopsJS.drawProtein("proteinGraphic", "P00533", ["S768I", "V769L"], ["red", "black"]);
```
## Contributing
Submit issues through the [Issues](https://github.com/koensci/lollipopsJS/issues) tab.

## License
LollipopsJS is released under the [GPL license](LICENSE.md).

## References
Jay JJ, Brouwer C (2016) Lollipops in the Clinic: Information Dense Mutation Plots for Precision Medicine. PLoS ONE 11(8): e0160519. doi: [10.1371/journal.pone.0160519]
