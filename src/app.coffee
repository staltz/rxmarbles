#
# App entry-point.
#
Package = require 'package.json'
binder = require 'rxmarbles/binder'
Sandbox = require 'rxmarbles/views/sandbox'
OperatorsMenuModel = require 'rxmarbles/models/operators-menu'
OperatorsMenuView = require 'rxmarbles/views/operators-menu'
OperatorsMenuInterpreter = require 'rxmarbles/interpreters/operators-menu'
DOMDelegator = require 'dom-delegator'
Utils = require 'rxmarbles/views/utils'

domDelegator = DOMDelegator()

sandboxContainer = document.querySelector(".js-sandboxContainer")
sandboxContainer.innerHTML = ""
sandboxContainer.appendChild(Sandbox.render())

binder(OperatorsMenuModel, OperatorsMenuView, OperatorsMenuInterpreter)
# binder(SandboxModel, SandboxView, SandboxInterpreter)

Utils.renderVTreeStream(OperatorsMenuView.vtree$, ".js-operatorsMenuContainer")

versionElement = document.querySelector("a.js-appVersion")
versionElement.textContent = "v#{Package.version}"
versionElement.href = "https://github.com/staltz/rxmarbles/releases/tag/v#{Package.version}"

rxVersion = Package.dependencies.rx.replace(/(~|\^|\.\+)*/g, "")
rxElement = document.querySelector("a.js-rxjsVersion")
rxElement.textContent = "RxJS v#{rxVersion}"
rxElement.href = "https://github.com/Reactive-Extensions/RxJS/tree/v#{rxVersion}"
