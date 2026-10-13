# Public adapter contracts

`createFlightReleaseGraph` accepts the same `ReleaseManifest` used by the
simulator release assembly and the shared graph labels/ownership record. It
passes these to `graphFromReleaseManifest`, with graph owner `0sfs`; it does
not implement another manifest or graph validator. Real artifact ownership,
runtime/content/tool/reference edges, missing capabilities, all installed
third-party/transitive/native/content pins and licenses come from that assembly.
The host must supply an immutable public snapshot without credentials or local
paths and the dependency-owner rules prohibiting Earth/Campus imports of Flight.

`./panel` wraps the shared `createAboutPanel` with Flight content. Built-from,
identity, published-version subscriptions and latest-deploy transport stay
host supplied; its disposer belongs to the host's one panel lifecycle. It has
no polling, release discovery, native allocation or source fetch. The runtime
root/core remains DOM-free; panel is explicit. Shared graph presentation and
site build wiring remain pending exact artifact adoption.
