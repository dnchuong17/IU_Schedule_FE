"use client"

import { useState, useEffect, useRef } from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

import { motion } from "framer-motion"
import { Helmet } from "react-helmet"
import { fetchWorkflows, ApiWorkflow, addWorkflows } from "@/lib/API"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { BarLoader, HashLoader } from "react-spinners"

interface Workflow {
  index: number
  userName?: string
  workflowId?: number
  workflowName: string
  lastUpdated?: string
  createdAt?: string
}

export default function WorkflowList() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Workflow | null>(null)
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newWorkflowName, setNewWorkflowName] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])

  const toastShownRef = useRef<boolean>(false)

  const columns: ColumnDef<Workflow>[] = [
    {
      accessorKey: "index",
      header: "No.",
      cell: ({ row }) => (
        <div className="font-semibold">{row.original.index}</div>
      ),
      size: 100,
    },
    {
      accessorKey: "userName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-start font-bold"
          >
            Username
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="truncate">{row.original.userName}</div>
      ),
      size: 150,
    },
    {
      accessorKey: "workflowId",
      header: "Workflow ID",
      cell: ({ row }) => (
        <div className="truncate">{row.original.workflowId}</div>
      ),
      size: 100,
    },
    {
      accessorKey: "workflowName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-start font-bold"
          >
            Workflow name
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="truncate">{row.original.workflowName}</div>
      ),
      size: 200,
    },
    {
      accessorKey: "lastUpdated",
      header: "Last updated",
      cell: ({ row }) => (
        <div className="truncate">{row.original.lastUpdated}</div>
      ),
      size: 150,
    },
    {
      accessorKey: "createdAt",
      header: "Created at",
      cell: ({ row }) => (
        <div className="truncate">{row.original.createdAt}</div>
      ),
      size: 150,
    },
    {
      id: "actions",
      size: 100,
      cell: ({ row }) => {
        const workflow = row.original
        return (
          <div className="flex justify-end space-x-2">
            {editingIndex === workflow.index ? (
              <>
                <Button
                  onClick={saveEditing}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  onClick={cancelEditing}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => startEditing(workflow)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteWorkflow(workflow.index)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: workflows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  useEffect(() => {
    const loadWorkflows = async () => {
      setLoading(true)
      try {
        const apiWorkflows: ApiWorkflow[] = await fetchWorkflows(100)
        const mappedWorkflows = apiWorkflows.map((item, index) => ({
          index: index + 1,
          userName: item.UserName,
          workflowId: item.WorkFlowId,
          workflowName: item.WorkFlowName,
          lastUpdated: item.LastUpdated,
          createdAt: item.CreatedAt,
        }))
        setWorkflows(mappedWorkflows)
        if (!toastShownRef.current) {
          toast.success("Get workflows successfully!")
          toastShownRef.current = true
        }
      } catch (error) {
        console.error("Error loading workflows:", error)
        if (!toastShownRef.current) {
          toast.error("Error loading workflows!")
          toastShownRef.current = true
        }
      } finally {
        setLoading(false)
      }
    }

    loadWorkflows()
  }, [])

  const addWorkflow = async () => {
    if (newWorkflowName.length === 0) {
      toast.error("Workflow name cannot be empty!")
      return
    }
    setIsAdding(true)
    try {
      await addWorkflows(100, newWorkflowName)
      setWorkflows((prevWorkflows) => [
        {
          index: prevWorkflows.length + 1,
          workflowName: newWorkflowName,
          userName: "New User",
          workflowId: prevWorkflows.length + 1,
          lastUpdated: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        ...prevWorkflows,
      ])
      setIsAddDialogOpen(false)
      setNewWorkflowName("")
      toast.success("Workflow added successfully!")
    } catch (error) {
      console.error("Error adding workflow:", error)
      toast.error("Failed to add workflow!")
    } finally {
      setIsAdding(false)
    }
  }

  const startEditing = (workflow: Workflow) => {
    setEditingIndex(workflow.index)
    setEditForm({ ...workflow })
  }

  const saveEditing = () => {
    if (editForm) {
      setWorkflows((prevWorkflows) =>
        prevWorkflows.map((w) => (w.index === editForm.index ? editForm : w))
      )
      setEditingIndex(null)
      setEditForm(null)
      toast.success("Workflow updated successfully!")
    }
  }

  const cancelEditing = () => {
    setEditingIndex(null)
    setEditForm(null)
  }

  const deleteWorkflow = (index: number) => {
    setWorkflows((prevWorkflows) =>
      prevWorkflows.filter((w) => w.index !== index)
    )
    toast.success("Workflow deleted successfully!")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-zinc-700 via-slate-800 to-zinc-800">
      <ToastContainer />
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
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    table.setGlobalFilter(e.target.value)
                  }}
                  className="pl-10"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              <Dialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto shadow-md">
                    <Plus
                      className="mr-2"
                      size={18}
                    />
                    Add new workflow
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add new workflow</DialogTitle>
                    <DialogDescription>
                      Enter the information for your new workflow here.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex justify-center items-center gap-4">
                      <Label
                        htmlFor="name"
                        className="text-center w-2/4"
                      >
                        Workflow name
                      </Label>
                      <Input
                        id="name"
                        value={newWorkflowName}
                        onChange={(e) => setNewWorkflowName(e.target.value)}
                        placeholder="Enter workflow name"
                        className="col-span-3 ring-1 ring-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={addWorkflow}
                      disabled={isAdding}
                    >
                      {isAdding ? (
                        <BarLoader color="#3f3f46" />
                      ) : (
                        "Add Workflow"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead
                              key={header.id}
                              style={{ width: `${header.getSize()}px` }}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-24"
                        >
                          <div className="flex justify-center items-center h-full">
                            <HashLoader color="#272e3f" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              style={{
                                width: `${cell.column.getSize()}px`,
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-24 text-center"
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
