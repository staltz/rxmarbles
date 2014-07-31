Examples = require 'rxmarbles/models/examples'
Utils = require 'rxmarbles/controllers/utils'
Sandbox = require 'rxmarbles/views/sandbox'

#
# Exports an array of diagram streams representing the input diagrams.
#

example = Examples["merge"] # TODO generalize me

diagram0 = Utils.prepareInputDiagram(example["inputs"][0])
diagram1 = Utils.prepareInputDiagram(example["inputs"][1])

diagramStream0 = Sandbox.getDiagramDataStreams()[0].startWith(diagram0)
diagramStream1 = Sandbox.getDiagramDataStreams()[1].startWith(diagram1)

module.exports = [diagramStream0, diagramStream1]
