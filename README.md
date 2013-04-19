Taxiderm

[Jackalop]

Takes the skins from your frontend and pumps them full of sawdust.
Creates life-like webapps which can easily be:

* worked on for CSS tweaks in hard to reach places
* shared with L10n community

Usage:

Create a .taxiderm file in your project which maps preview urls, for each template you provide
enough data so it will render with out blowing up.
You may present the same template with several different sets of data.
Sane defaults remove the need for supplying everything.

Example `.taxiderm`

    {
      templateRoot: "server/views",
      "id_mismatch.ejs": {
        "ID Mismatch Error": {
          claimed: "alice@yahoo.com",
          mismatched: "alice@yahoo.co.uk",
          provider: "Yahoo",
          providerURL: "https://mail.yahoo.com"
        }
      }
    }

`templateRoot` defaults to `views`.
It is calculated relative to the .taxiderm file or the current working directory when `taxiderm` is run.

The `id_mismatch.ejs` top level key is a tempalte file name.
`taxiderm` will load this template and render it with the provided data.
`ID Mismatch Error` is the link name which will be avialble from the taxiderm app.
It allows you to have multiple different links and datasets for the same template,
which is useful for previewing conditional logic.