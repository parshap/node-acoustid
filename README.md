# node-acoustid

Get MusicBrainz metadata for a given audio file via the [AcoustID Web
Service](http://acoustid.org/webservice).

# Example

```js
var acoustid = require("acoustid");
acoustid("./audio.mp3", { key: "8XaBELgH" }, callback);
function callback(err, results) {
	if (err) throw err;
	var artist = results[0].recordings[0].artists[0].name;
	console.log(artist);
}
```

# Documentation

## `acoustid(file, options, callback)`

Looks up information about the given audio file.

*File* must be the path to an audio file.

*Options* must be an object with the following keys:

 * `key`: Your AcoustID Web Service API Key (**required**)
 * `meta`: Meta parameter used in AcoustID API call (optional, default:
   all meta data) (see [docs](http://acoustid.org/webservice#lookup))
 * `fpcalc`: Passed to *fpcalc* as options (optional, see [*fpcalc*
   docs][fpcalc docs])

*Callback* must be a function that will be called with `callback(err,
results)`.

# Installation 

This module depends on [node-fpcalc][fpcalc] to calculate audio
fingerprints. **The [*fpcalc* command-line
tool](http://acoustid.org/chromaprint) must be installed.** This is
often available via your package manager (e.g., `apt-get install
libchromaprint-tools` or `brew install chromaprint`).

```
npm install acoustid
```

[fpcalc]: https://github.com/parshap/node-fpcalc
[fpcalc docs]: https://github.com/parshap/node-fpcalc#api
