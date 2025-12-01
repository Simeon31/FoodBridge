using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodBridge.Server.Migrations
{
    /// <inheritdoc />
    public partial class Database_Backbone_Architecture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Donors",
                columns: table => new
                {
                    DonorId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    DonorType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PostalCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Donors", x => x.DonorId);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    ProductId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DefaultUnitType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IsPerishable = table.Column<bool>(type: "bit", nullable: false),
                    OptimalStorageCondition = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.ProductId);
                });

            migrationBuilder.CreateTable(
                name: "Donations",
                columns: table => new
                {
                    DonationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DonorId = table.Column<int>(type: "int", nullable: false),
                    DonationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReceiptNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ReceivedBy = table.Column<int>(type: "int", nullable: false),
                    InspectedBy = table.Column<int>(type: "int", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Donations", x => x.DonationId);
                    table.ForeignKey(
                        name: "FK_Donations_Donors_DonorId",
                        column: x => x.DonorId,
                        principalTable: "Donors",
                        principalColumn: "DonorId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DonationAuditTrail",
                columns: table => new
                {
                    AuditId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DonationId = table.Column<int>(type: "int", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ActionBy = table.Column<int>(type: "int", nullable: false),
                    ActionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Details = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonationAuditTrail", x => x.AuditId);
                    table.ForeignKey(
                        name: "FK_DonationAuditTrail_Donations_DonationId",
                        column: x => x.DonationId,
                        principalTable: "Donations",
                        principalColumn: "DonationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DonationItems",
                columns: table => new
                {
                    DonationItemId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DonationId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    QuantityReceived = table.Column<int>(type: "int", nullable: false),
                    UnitType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ExpirationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ManufactureDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    BatchNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    StorageCondition = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonationItems", x => x.DonationItemId);
                    table.ForeignKey(
                        name: "FK_DonationItems_Donations_DonationId",
                        column: x => x.DonationId,
                        principalTable: "Donations",
                        principalColumn: "DonationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DonationItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DonationReceipts",
                columns: table => new
                {
                    ReceiptId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DonationId = table.Column<int>(type: "int", nullable: false),
                    ReceiptNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TotalItemsReceived = table.Column<int>(type: "int", nullable: false),
                    TotalItemsApproved = table.Column<int>(type: "int", nullable: false),
                    GeneratedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IssuedBy = table.Column<int>(type: "int", nullable: false),
                    SentToDonor = table.Column<bool>(type: "bit", nullable: false),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PDFPath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonationReceipts", x => x.ReceiptId);
                    table.ForeignKey(
                        name: "FK_DonationReceipts_Donations_DonationId",
                        column: x => x.DonationId,
                        principalTable: "Donations",
                        principalColumn: "DonationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DonationDispositions",
                columns: table => new
                {
                    DispositionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DonationItemId = table.Column<int>(type: "int", nullable: false),
                    DispositionType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    QuantityApproved = table.Column<int>(type: "int", nullable: true),
                    QuantityRejected = table.Column<int>(type: "int", nullable: true),
                    ApprovedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ApprovedBy = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonationDispositions", x => x.DispositionId);
                    table.ForeignKey(
                        name: "FK_DonationDispositions_DonationItems_DonationItemId",
                        column: x => x.DonationItemId,
                        principalTable: "DonationItems",
                        principalColumn: "DonationItemId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InventoryItems",
                columns: table => new
                {
                    InventoryItemId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    StorageLocationId = table.Column<int>(type: "int", nullable: true),
                    QuantityOnHand = table.Column<int>(type: "int", nullable: false),
                    ExpirationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DateReceived = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SourceDonationItemId = table.Column<int>(type: "int", nullable: true),
                    IsBlocked = table.Column<bool>(type: "bit", nullable: false),
                    BlockReason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventoryItems", x => x.InventoryItemId);
                    table.ForeignKey(
                        name: "FK_InventoryItems_DonationItems_SourceDonationItemId",
                        column: x => x.SourceDonationItemId,
                        principalTable: "DonationItems",
                        principalColumn: "DonationItemId");
                    table.ForeignKey(
                        name: "FK_InventoryItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QualityInspections",
                columns: table => new
                {
                    InspectionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DonationItemId = table.Column<int>(type: "int", nullable: false),
                    InspectionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    InspectedBy = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PackagingIntegrity = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ProductAppearance = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TemperatureCheck = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    HasExpiredItems = table.Column<bool>(type: "bit", nullable: false),
                    HasAllergenInfo = table.Column<bool>(type: "bit", nullable: false),
                    HasNutritionLabel = table.Column<bool>(type: "bit", nullable: false),
                    IsFromApprovedSource = table.Column<bool>(type: "bit", nullable: false),
                    DecisionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QualityInspections", x => x.InspectionId);
                    table.ForeignKey(
                        name: "FK_QualityInspections_DonationItems_DonationItemId",
                        column: x => x.DonationItemId,
                        principalTable: "DonationItems",
                        principalColumn: "DonationItemId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WasteRecords",
                columns: table => new
                {
                    WasteRecordId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DonationItemId = table.Column<int>(type: "int", nullable: true),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    WasteReason = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DisposalMethod = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DisposedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DisposedBy = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WasteRecords", x => x.WasteRecordId);
                    table.ForeignKey(
                        name: "FK_WasteRecords_DonationItems_DonationItemId",
                        column: x => x.DonationItemId,
                        principalTable: "DonationItems",
                        principalColumn: "DonationItemId");
                    table.ForeignKey(
                        name: "FK_WasteRecords_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DonationAuditTrail_DonationId",
                table: "DonationAuditTrail",
                column: "DonationId");

            migrationBuilder.CreateIndex(
                name: "IX_DonationDispositions_DonationItemId",
                table: "DonationDispositions",
                column: "DonationItemId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DonationItems_DonationId",
                table: "DonationItems",
                column: "DonationId");

            migrationBuilder.CreateIndex(
                name: "IX_DonationItems_ProductId",
                table: "DonationItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_DonationReceipts_DonationId",
                table: "DonationReceipts",
                column: "DonationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Donations_DonorId",
                table: "Donations",
                column: "DonorId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryItems_ProductId",
                table: "InventoryItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryItems_SourceDonationItemId",
                table: "InventoryItems",
                column: "SourceDonationItemId");

            migrationBuilder.CreateIndex(
                name: "IX_QualityInspections_DonationItemId",
                table: "QualityInspections",
                column: "DonationItemId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WasteRecords_DonationItemId",
                table: "WasteRecords",
                column: "DonationItemId");

            migrationBuilder.CreateIndex(
                name: "IX_WasteRecords_ProductId",
                table: "WasteRecords",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DonationAuditTrail");

            migrationBuilder.DropTable(
                name: "DonationDispositions");

            migrationBuilder.DropTable(
                name: "DonationReceipts");

            migrationBuilder.DropTable(
                name: "InventoryItems");

            migrationBuilder.DropTable(
                name: "QualityInspections");

            migrationBuilder.DropTable(
                name: "WasteRecords");

            migrationBuilder.DropTable(
                name: "DonationItems");

            migrationBuilder.DropTable(
                name: "Donations");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Donors");
        }
    }
}
