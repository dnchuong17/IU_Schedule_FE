import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Check,
  X,
} from "lucide-react"

import { motion } from "framer-motion"
import { Helmet } from "react-helmet"

interface Workflow {
  id: string
  userName: string
  workflowId: string
  workflowName: string
  lastUpdated: string
  createdAt: string
}

const initialWorkflows: Workflow[] = [
  {
    id: "1",
    userName: "John Doe",
    workflowId: "WF-001",
    workflowName: "Daily Report Generation",
    lastUpdated: "2024-05-15",
    createdAt: "2024-05-01",
  },
  {
    id: "2",
    userName: "Jane Smith",
    workflowId: "WF-002",
    workflowName: "Weekly Data Analysis",
    lastUpdated: "2024-05-14",
    createdAt: "2024-04-28",
  },
  {
    id: "3",
    userName: "Bob Johnson",
    workflowId: "WF-003",
    workflowName: "Monthly Financial Review",
    lastUpdated: "2024-05-10",
    createdAt: "2024-03-15",
  },
]

export default function WorkflowList() {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Workflow | null>(null)

  console.log("Workflows:", workflows)
  console.log("Search Term:", searchTerm)

  const filteredWorkflows = workflows.filter((workflow) => {
    console.log("Current Workflow:", workflow)
    return Object.values(workflow).some((value) => {
      console.log("Current Value:", value)
      return value.toLowerCase().includes(searchTerm.toLowerCase())
    })
  })

  console.log("Filtered Workflows:", filteredWorkflows)

  const addWorkflow = () => {
    console.log("addWorkflow")
    const newWorkflow: Workflow = {
      id: "34535",
      userName: "New User",
      workflowId: `WF-004`,
      workflowName: "New Workflow",
      lastUpdated: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
    }
    setWorkflows([...workflows, newWorkflow])
  }
  const startEditing = (workflow: Workflow) => {
    setEditingId(workflow.id)
    setEditForm({ ...workflow })
  }

  const saveEditing = () => {
    if (editForm) {
      setEditingId(null)
      setEditForm(null)
    }
  }
  const cancelEditing = () => {
    setEditingId(null)
    setEditForm(null)
  }

  const deleteWorkflow = () => {
    console.log("Delete")
  }

  const handleEditFormChange = (field: keyof Workflow, value: string) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-zinc-700 via-slate-800 to-zinc-800">
      <Helmet>
        <link
          rel="icon"
          type="image/svg+xml"
          href="/Workflow.png"
        />
        <title>IU Schedule - Workflow list</title>
        <meta
          name="description"
          content="IU Schedule - Manage and view your schedules efficiently."
        />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <Card className="w-full max-w-[95vw] mx-auto drop-shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Workflow list</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
              <div className="relative w-full sm:w-64 rounded-md shadow-md">
                <Input
                  type="text"
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              <Button
                onClick={addWorkflow}
                className="w-full sm:w-auto shadow-md"
              >
                <Plus
                  className="mr-2"
                  size={18}
                />
                Add Workflow
              </Button>
            </div>
            <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 ">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden ring-1 ring-black ring-opacity-5 sm:rounded-lg shadow-md p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px] sm:w-[200px]">
                          Username
                        </TableHead>
                        <TableHead className="w-[100px] sm:w-[150px]">
                          Workflow ID
                        </TableHead>
                        <TableHead className="w-[200px] sm:w-[250px]">
                          Workflow name
                        </TableHead>
                        <TableHead className="w-[120px] sm:w-[150px]">
                          Last updated
                        </TableHead>
                        <TableHead className="w-[120px] sm:w-[150px]">
                          Created at
                        </TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWorkflows.map((workflow) => (
                        <TableRow key={workflow.id}>
                          {(Object.keys(workflow) as Array<keyof Workflow>).map(
                            (key) =>
                              key !== "id" && (
                                <TableCell
                                  key={key}
                                  className="p-2"
                                >
                                  <div className="min-h-[2.5rem] flex items-center">
                                    {editingId === workflow.id ? (
                                      <Input
                                        value={
                                          editForm
                                            ? editForm[key]
                                            : workflow[key]
                                        }
                                        onChange={(e) =>
                                          handleEditFormChange(
                                            key,
                                            e.target.value
                                          )
                                        }
                                        className="w-full h-9 min-h-[2.5rem]"
                                      />
                                    ) : (
                                      <span className="truncate">
                                        {workflow[key]}
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                              )
                          )}
                          <TableCell className="p-2">
                            <div className="flex justify-end space-x-2">
                              {editingId === workflow.id ? (
                                <>
                                  <Button
                                    onClick={saveEditing}
                                    size="sm"
                                    variant="outline"
                                    className="h-9 px-2 py-1"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    onClick={cancelEditing}
                                    size="sm"
                                    variant="outline"
                                    className="h-9 px-2 py-1"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-9 w-9 p-0"
                                    >
                                      <span className="sr-only">Open menu</span>
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => startEditing(workflow)}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      <span>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => deleteWorkflow()}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      <span>Delete</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
