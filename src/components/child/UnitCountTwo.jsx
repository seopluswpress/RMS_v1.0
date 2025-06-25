import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import useReactApexChart from '../../hook/useReactApexChart'

const UnitCountTwo = () => {
    let { createChart } = useReactApexChart()

    return (
        <div className="container-fluid px-0">
            <div className="row g-4 mb-4">
                <div className="col-12 col-md-6 d-flex">
                    <div className="card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-1 flex-grow-1">
                        <div className="card-body p-0">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                                <div className="d-flex align-items-center gap-2">
                                    <span className="mb-0 w-48-px h-48-px bg-primary-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0">
                                        <Icon
                                            icon="mdi:account-group"
                                            className="icon"
                                            aria-label="Owners Icon"
                                        />
                                    </span>
                                    <div>
                                        <span className="mb-2 fw-medium text-secondary-light text-sm">
                                            Total Owners
                                        </span>
                                        <h6 className="fw-semibold">10</h6>
                                    </div>
                                </div>
                                <div
                                    id="new-user-chart"
                                    className="remove-tooltip-title rounded-tooltip-value"
                                >
                                    {/* Pass the color value here */}
                                    {createChart('#487fff')}
                                </div>
                            </div>
                            <p className="text-sm mb-0">
                                Increase by{" "}
                                <span className="bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm">
                                    +200
                                </span>{" "}
                                this week
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 d-flex">
                    <div className="card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-2 flex-grow-1">
                        <div className="card-body p-0">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                                <div className="d-flex align-items-center gap-2">
                                    <span className="mb-0 w-48-px h-48-px bg-success-main flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6">
                                        <Icon
                                            icon="mingcute:user-follow-fill"
                                            className="icon"
                                        />
                                    </span>
                                    <div>
                                        <span className="mb-2 fw-medium text-secondary-light text-sm">
                                           Total Expense
                                        </span>
                                        <h6 className="fw-semibold">5</h6>
                                    </div>
                                </div>
                                <div
                                    id="active-user-chart"
                                    className="remove-tooltip-title rounded-tooltip-value"
                                >
                                    {/* Pass the color value here */}
                                    {createChart('#45b369')}
                                </div>
                            </div>
                            <p className="text-sm mb-0">
                                Increase by{" "}
                                <span className="bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm">
                                    +200
                                </span>{" "}
                                this week
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UnitCountTwo
