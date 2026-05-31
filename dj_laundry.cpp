/*
 * DJ LAUNDRY SHOP MANAGEMENT SYSTEM
 * Implements: Loop, Functions, 2D Array, Sorting Array,
 *             Searching Array, Pointers, Structures, File Stream
 */

#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <iomanip>
#include <cstdlib>
using namespace std;

// ─────────────────────────────────────────────
//  CLEAR SCREEN  (cross-platform)
// ─────────────────────────────────────────────

void clearScreen() {
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif
}

void pauseScreen() {
    cout << "\n   \033[90m  ↩  Press Enter to continue...\033[0m";
    cin.ignore();
    cin.get();
}

// ─────────────────────────────────────────────
//  STRUCTURES
// ─────────────────────────────────────────────

struct Customer {
    int    id;
    string name;
    string contact;
    string address;
};

struct LaundryRecord {
    int    laundryID;
    int    customerID;
    string serviceType;   // e.g. "Wash", "Dry Clean", "Iron"
    double weightKg;
    string date;
    string status;        // Pending → Washing → Drying → Ready to Claim → Claimed
};

struct Payment {
    int    paymentID;
    int    laundryID;
    double totalAmount;
    string method;        // Cash / E-Payment
    double cashReceived;
    double change;
};

struct Inventory {
    int    itemID;
    string itemName;
    int    quantity;
    int    reorderLevel;
};

// ─────────────────────────────────────────────
//  GLOBALS  (dynamic arrays via pointers)
// ─────────────────────────────────────────────

const int MAX = 100;

Customer*      customers    = new Customer[MAX];
LaundryRecord* laundries    = new LaundryRecord[MAX];
Payment*       payments     = new Payment[MAX];
Inventory*     inventory    = new Inventory[MAX];

int custCount  = 0;
int laudCount  = 0;
int payCount   = 0;
int invCount   = 0;

// 2D array: inventory history  [item][transaction]  (qty delta)
int inventoryHistory[MAX][10];   // up to 10 transactions per item
int invHistCount[MAX] = {0};

// ─────────────────────────────────────────────
//  FILE-STREAM  –  LOAD
// ─────────────────────────────────────────────

void loadCustomers() {
    ifstream f("customers.txt");
    if (!f) return;
    while (f >> customers[custCount].id) {
        f.ignore();
        getline(f, customers[custCount].name);
        getline(f, customers[custCount].contact);
        getline(f, customers[custCount].address);
        custCount++;
    }
    f.close();
}

void loadLaundries() {
    ifstream f("laundries.txt");
    if (!f) return;
    while (f >> laundries[laudCount].laundryID
             >> laundries[laudCount].customerID) {
        f.ignore();
        getline(f, laundries[laudCount].serviceType);
        f >> laundries[laudCount].weightKg;
        f.ignore();
        getline(f, laundries[laudCount].date);
        getline(f, laundries[laudCount].status);
        laudCount++;
    }
    f.close();
}

void loadPayments() {
    ifstream f("payments.txt");
    if (!f) return;
    while (f >> payments[payCount].paymentID
             >> payments[payCount].laundryID
             >> payments[payCount].totalAmount) {
        f.ignore();
        getline(f, payments[payCount].method);
        f >> payments[payCount].cashReceived
          >> payments[payCount].change;
        payCount++;
    }
    f.close();
}

void loadInventory() {
    ifstream f("inventory.txt");
    if (!f) return;
    while (f >> inventory[invCount].itemID) {
        f.ignore();
        getline(f, inventory[invCount].itemName);
        f >> inventory[invCount].quantity
          >> inventory[invCount].reorderLevel;
        invCount++;
    }
    f.close();
}

void loadAllData() {
    loadCustomers();
    loadLaundries();
    loadPayments();
    loadInventory();
    cout << "\n   \033[1;32m  ✔  Data loaded successfully.\033[0m\n";
}

// ─────────────────────────────────────────────
//  FILE-STREAM  –  SAVE
// ─────────────────────────────────────────────

void saveCustomers() {
    ofstream f("customers.txt");
    for (int i = 0; i < custCount; i++)
        f << customers[i].id    << "\n"
          << customers[i].name  << "\n"
          << customers[i].contact << "\n"
          << customers[i].address << "\n";
    f.close();
}

void saveLaundries() {
    ofstream f("laundries.txt");
    for (int i = 0; i < laudCount; i++)
        f << laundries[i].laundryID    << " "
          << laundries[i].customerID   << "\n"
          << laundries[i].serviceType  << "\n"
          << laundries[i].weightKg     << "\n"
          << laundries[i].date         << "\n"
          << laundries[i].status       << "\n";
    f.close();
}

void savePayments() {
    ofstream f("payments.txt");
    for (int i = 0; i < payCount; i++)
        f << payments[i].paymentID    << " "
          << payments[i].laundryID    << " "
          << payments[i].totalAmount  << "\n"
          << payments[i].method       << "\n"
          << payments[i].cashReceived << " "
          << payments[i].change       << "\n";
    f.close();
}

void saveInventory() {
    ofstream f("inventory.txt");
    for (int i = 0; i < invCount; i++)
        f << inventory[i].itemID       << "\n"
          << inventory[i].itemName     << "\n"
          << inventory[i].quantity     << " "
          << inventory[i].reorderLevel << "\n";
    f.close();
}

void saveAllData() {
    saveCustomers();
    saveLaundries();
    savePayments();
    saveInventory();
    cout << "\n   \033[1;32m  ✔  All data saved to files.\033[0m\n";
}

// ─────────────────────────────────────────────
//  SORTING  (bubble sort by ID)
// ─────────────────────────────────────────────

void sortCustomersByID() {
    for (int i = 0; i < custCount - 1; i++)
        for (int j = 0; j < custCount - i - 1; j++)
            if (customers[j].id > customers[j+1].id)
                swap(customers[j], customers[j+1]);
}

void sortCustomersByName() {
    for (int i = 0; i < custCount - 1; i++)
        for (int j = 0; j < custCount - i - 1; j++)
            if (customers[j].name > customers[j+1].name)
                swap(customers[j], customers[j+1]);
}

// ─────────────────────────────────────────────
//  SEARCHING  (linear search)
// ─────────────────────────────────────────────

// Returns pointer to Customer, or nullptr if not found
Customer* searchCustomerByID(int id) {
    for (int i = 0; i < custCount; i++)
        if (customers[i].id == id)
            return &customers[i];
    return nullptr;
}

// Returns pointer to LaundryRecord by laundryID, or nullptr
LaundryRecord* searchLaundryByID(int lid) {
    for (int i = 0; i < laudCount; i++)
        if (laundries[i].laundryID == lid)
            return &laundries[i];
    return nullptr;
}

// Returns first laundry record ready to claim for a customer
LaundryRecord* searchReadyLaundry(int custID) {
    for (int i = 0; i < laudCount; i++)
        if (laundries[i].customerID == custID &&
            laundries[i].status == "Ready to Claim")
            return &laundries[i];
    return nullptr;
}

// ─────────────────────────────────────────────
//  FUNCTIONS – helpers
// ─────────────────────────────────────────────

double computeTotalAmount(const LaundryRecord& lr) {
    // Simple pricing: base 50 + 30 per kg
    double base = 50.0;
    double perKg = 30.0;
    return base + (lr.weightKg * perKg);
}

void generateClaimReceipt(int laundryID) {
    LaundryRecord* lr = searchLaundryByID(laundryID);
    if (!lr) { cout << "Laundry record not found.\n"; return; }
    Customer* c = searchCustomerByID(lr->customerID);
    cout << "\n==============================\n";
    cout << "       DJ LAUNDRY SHOP        \n";
    cout << "       CLAIM RECEIPT          \n";
    cout << "==============================\n";
    cout << "Laundry ID : " << lr->laundryID   << "\n";
    cout << "Customer   : " << (c ? c->name : "Unknown") << "\n";
    cout << "Service    : " << lr->serviceType  << "\n";
    cout << "Weight     : " << lr->weightKg     << " kg\n";
    cout << "Date       : " << lr->date         << "\n";
    cout << "Status     : " << lr->status       << "\n";
    cout << "==============================\n";
}

// ─────────────────────────────────────────────
//  MODULE 1 – CUSTOMER INFORMATION
// ─────────────────────────────────────────────

void module1_CustomerInformation() {
    clearScreen();
    cout << "\n   \033[1;36m╔══════════════════════════════════════════════════════╗\033[0m\n";
    cout << "   \033[1;36m║\033[0m   \033[1;33m👕  [ 1 ]  CUSTOMER INFORMATION                    \033[0m\033[1;36m║\033[0m\n";
    cout << "   \033[1;36m╚══════════════════════════════════════════════════════╝\033[0m\n\n";
    Customer c;
    cout << "Enter Customer ID    : "; cin >> c.id;
    cin.ignore();
    cout << "Enter Name           : "; getline(cin, c.name);
    cout << "Enter Contact        : "; getline(cin, c.contact);
    cout << "Enter Address        : "; getline(cin, c.address);

    customers[custCount++] = c;   // store via pointer arithmetic

    // Sort after insertion
    int sortChoice;
    cout << "\nSort by: 1) ID  2) Name: ";
    cin >> sortChoice;
    if (sortChoice == 1) sortCustomersByID();
    else                 sortCustomersByName();

    // Optional search
    char search;
    cout << "Search for a customer? (y/n): "; cin >> search;
    if (search == 'y' || search == 'Y') {
        int sid;
        cout << "Enter Customer ID to search: "; cin >> sid;
        Customer* found = searchCustomerByID(sid);
        if (found)
            cout << "\nFound: " << found->id << " | "
                 << found->name << " | " << found->contact << "\n";
        else
            cout << "Customer not found.\n";
    }

    saveCustomers();

    // Display all
    cout << "\n--- Customer List ---\n";
    cout << left << setw(6)  << "ID"
                 << setw(20) << "Name"
                 << setw(15) << "Contact"
                 << "Address\n";
    cout << string(60, '-') << "\n";
    for (int i = 0; i < custCount; i++)
        cout << setw(6)  << customers[i].id
             << setw(20) << customers[i].name
             << setw(15) << customers[i].contact
             << customers[i].address << "\n";
}

// ─────────────────────────────────────────────
//  MODULE 2 – LAUNDRY STATUS TRACKING
// ─────────────────────────────────────────────

void module2_LaundryStatusTracking() {
    clearScreen();
    cout << "\n   \033[1;36m╔══════════════════════════════════════════════════════╗\033[0m\n";
    cout << "   \033[1;36m║\033[0m   \033[1;33m🌀  [ 2 ]  LAUNDRY STATUS TRACKING                \033[0m\033[1;36m║\033[0m\n";
    cout << "   \033[1;36m╚══════════════════════════════════════════════════════╝\033[0m\n\n";
    LaundryRecord lr;
    cout << "Enter Customer ID  : "; cin >> lr.customerID;
    cin.ignore();
    cout << "Service Type (Wash/Dry Clean/Iron): "; getline(cin, lr.serviceType);
    cout << "Weight (kg)        : "; cin >> lr.weightKg;
    cin.ignore();
    cout << "Date (YYYY-MM-DD)  : "; getline(cin, lr.date);

    // Generate laundry ID
    lr.laundryID = 1000 + laudCount + 1;
    lr.status    = "Pending";
    laundries[laudCount++] = lr;

    // Simulate status progression
    cout << "\nUpdating status...\n";
    string stages[] = {"Washing", "Drying", "Ready to Claim"};
    LaundryRecord* rec = &laundries[laudCount - 1];
    for (int i = 0; i < 3; i++) {
        rec->status = stages[i];
        cout << "  Status -> " << rec->status << "\n";
    }

    saveLaundries();
    cout << "\nLaundry Status: " << rec->status << " (ID: " << rec->laundryID << ")\n";
}

// ─────────────────────────────────────────────
//  MODULE 3 – PAYMENT SYSTEM
// ─────────────────────────────────────────────

void module3_PaymentSystem() {
    clearScreen();
    cout << "\n   \033[1;36m╔══════════════════════════════════════════════════════╗\033[0m\n";
    cout << "   \033[1;36m║\033[0m   \033[1;33m💳  [ 3 ]  PAYMENT SYSTEM                          \033[0m\033[1;36m║\033[0m\n";
    cout << "   \033[1;36m╚══════════════════════════════════════════════════════╝\033[0m\n\n";
    int lid;
    cout << "Enter Laundry ID: "; cin >> lid;

    // Search laundry record (Searching Array)
    LaundryRecord* lr = searchLaundryByID(lid);
    if (!lr) { cout << "Laundry record not found.\n"; return; }

    double total = computeTotalAmount(*lr);
    cout << fixed << setprecision(2);
    cout << "Total Amount: PHP " << total << "\n";

    // Payment method
    cout << "Select Payment Method:\n  1. Cash\n  2. E-Payment\n> ";
    int method; cin >> method;

    Payment p;
    p.paymentID   = 2000 + payCount + 1;
    p.laundryID   = lid;
    p.totalAmount = total;

    if (method == 1) {
        // Cash payment
        p.method = "Cash";
        cout << "Enter Cash Received: PHP "; cin >> p.cashReceived;
        p.change = p.cashReceived - total;
        if (p.change < 0) {
            cout << "Insufficient cash!\n"; return;
        }
        cout << "Change: PHP " << p.change << "\n";
    } else {
        // E-Payment
        p.method       = "E-Payment";
        p.cashReceived = total;
        p.change       = 0;
        cout << "Select platform: 1) GCash  2) Maya  3) Online Banking\n> ";
        int ep; cin >> ep;
        string platforms[] = {"GCash", "Maya", "Online Banking"};
        if (ep >= 1 && ep <= 3)
            cout << "Processing " << platforms[ep-1] << "...\n";
        cout << "E-Payment confirmed.\n";
    }

    payments[payCount++] = p;
    savePayments();

    // Display payment summary
    cout << "\n--- Payment Summary ---\n";
    cout << "Payment ID  : " << p.paymentID   << "\n";
    cout << "Laundry ID  : " << p.laundryID   << "\n";
    cout << "Total       : PHP " << p.totalAmount  << "\n";
    cout << "Method      : " << p.method       << "\n";
    if (p.method == "Cash")
        cout << "Change      : PHP " << p.change << "\n";
}

// ─────────────────────────────────────────────
//  MODULE 4 – CLAIM RECEIPT
// ─────────────────────────────────────────────

void module4_ClaimReceipt() {
    clearScreen();
    cout << "\n   \033[1;36m╔══════════════════════════════════════════════════════╗\033[0m\n";
    cout << "   \033[1;36m║\033[0m   \033[1;33m🧾  [ 4 ]  CLAIM RECEIPT                           \033[0m\033[1;36m║\033[0m\n";
    cout << "   \033[1;36m╚══════════════════════════════════════════════════════╝\033[0m\n\n";
    int cid;
    cout << "Enter Customer ID: "; cin >> cid;

    // Verify customer (Searching Array)
    Customer* c = searchCustomerByID(cid);
    if (!c) { cout << "Customer not found.\n"; return; }
    cout << "Customer verified: " << c->name << "\n";

    // Search for ready laundry
    LaundryRecord* lr = searchReadyLaundry(cid);
    if (!lr) { cout << "No laundry ready to claim for this customer.\n"; return; }

    generateClaimReceipt(lr->laundryID);

    // Update status to Claimed
    lr->status = "Claimed";
    cout << "Status updated to: Claimed\n";
    saveLaundries();
}

// ─────────────────────────────────────────────
//  MODULE 5 – INVENTORY AND DETERGENT MONITORING
// ─────────────────────────────────────────────

void module5_InventoryMonitoring() {
    clearScreen();
    cout << "\n   \033[1;36m╔══════════════════════════════════════════════════════╗\033[0m\n";
    cout << "   \033[1;36m║\033[0m   \033[1;33m🧴  [ 5 ]  INVENTORY & DETERGENT MONITORING        \033[0m\033[1;36m║\033[0m\n";
    cout << "   \033[1;36m╚══════════════════════════════════════════════════════╝\033[0m\n\n";

    // Display inventory table (2D Array for history)
    cout << "\n" << left
         << setw(6)  << "ID"
         << setw(20) << "Item"
         << setw(10) << "Qty"
         << setw(15) << "Reorder Lvl"
         << "Status\n";
    cout << string(55, '-') << "\n";

    for (int i = 0; i < invCount; i++) {
        string status = (inventory[i].quantity <= inventory[i].reorderLevel)
                        ? "** LOW STOCK **" : "OK";
        cout << setw(6)  << inventory[i].itemID
             << setw(20) << inventory[i].itemName
             << setw(10) << inventory[i].quantity
             << setw(15) << inventory[i].reorderLevel
             << status   << "\n";
    }

    // Add or update stock
    cout << "\n1) Add New Item\n2) Update Stock\n3) Back\n> ";
    int choice; cin >> choice;

    if (choice == 1) {
        Inventory item;
        item.itemID = 3000 + invCount + 1;
        cin.ignore();
        cout << "Item Name     : "; getline(cin, item.itemName);
        cout << "Quantity      : "; cin >> item.quantity;
        cout << "Reorder Level : "; cin >> item.reorderLevel;
        inventory[invCount] = item;
        // Record in 2D history array
        inventoryHistory[invCount][invHistCount[invCount]++] = item.quantity;
        invCount++;
        cout << "Item added.\n";
    } else if (choice == 2) {
        int id, delta;
        cout << "Enter Item ID   : "; cin >> id;
        cout << "Add(+) / Deduct(-) qty: "; cin >> delta;

        for (int i = 0; i < invCount; i++) {
            if (inventory[i].itemID == id) {
                inventory[i].quantity += delta;
                // Record transaction in 2D history array
                int col = invHistCount[i];
                if (col < 10)
                    inventoryHistory[i][invHistCount[i]++] = delta;
                cout << "Updated " << inventory[i].itemName
                     << " | New Qty: " << inventory[i].quantity << "\n";

                // Check reorder level (Decision diamond)
                if (inventory[i].quantity <= inventory[i].reorderLevel)
                    cout << "*** LOW STOCK WARNING: " << inventory[i].itemName << " ***\n";
                else
                    cout << "Stock level OK.\n";
                break;
            }
        }
    }

    saveInventory();
}

// ─────────────────────────────────────────────
//  MODULE 6 – EXIT
// ─────────────────────────────────────────────

void module6_Exit() {
    clearScreen();
    saveAllData();
    cout << "\n";
    cout << "   \033[1;36m╔══════════════════════════════════════════════════════╗\033[0m\n";
    cout << "   \033[1;36m║\033[0m                                                      \033[1;36m║\033[0m\n";
    cout << "   \033[1;36m║\033[0m      \033[1;33m✦  Thank you for using DJ Laundry Shop!  ✦     \033[0m\033[1;36m║\033[0m\n";
    cout << "   \033[1;36m║\033[0m                                                      \033[1;36m║\033[0m\n";
    cout << "   \033[1;36m║\033[0m         \033[35m~~ Keep it clean, keep it fresh! ~~          \033[0m\033[1;36m║\033[0m\n";
    cout << "   \033[1;36m║\033[0m                                                      \033[1;36m║\033[0m\n";
    cout << "   \033[1;36m║\033[0m              \033[90m[ All data saved to files ]              \033[0m\033[1;36m║\033[0m\n";
    cout << "   \033[1;36m║\033[0m                                                      \033[1;36m║\033[0m\n";
    cout << "   \033[1;36m╚══════════════════════════════════════════════════════╝\033[0m\n";
    cout << "\n";
}

// ─────────────────────────────────────────────
//  MAIN  –  LOOP + MENU
// ─────────────────────────────────────────────

int main() {
    clearScreen();

    // ╔══════════════════════════════════════════════════════════════╗
    //  SPLASH SCREEN
    // ╚══════════════════════════════════════════════════════════════╝
    cout << "\n";
    cout << "   \033[36m+----------------------------------------------------------+\033[0m\n";
    cout << "   \033[36m|                                                          |\033[0m\n";
    cout << "   \033[36m|\033[0m  \033[1;34m ____      _      _       ____  __  __  _   _  ____  \033[0m  \033[36m|\033[0m\n";
    cout << "   \033[36m|\033[0m  \033[1;34m|  _ \\ _  | |    | |     / __ \\|  \\/  || \\ | ||  _ \\ \033[0m  \033[36m|\033[0m\n";
    cout << "   \033[36m|\033[0m  \033[1;34m| | | | | | |    | |    | |  | | |\\/| ||  \\| || | | |\033[0m  \033[36m|\033[0m\n";
    cout << "   \033[36m|\033[0m  \033[1;34m| |_| | |_| |    | |___ | |__| | |  | || |\\  || |_| |\033[0m  \033[36m|\033[0m\n";
    cout << "   \033[36m|\033[0m  \033[1;34m|____/ \\___/|    |_____| \\____/|_|  |_||_| \\_||____/ \033[0m  \033[36m|\033[0m\n";
    cout << "   \033[36m|\033[0m                                                          \033[36m|\033[0m\n";
    cout << "   \033[36m|\033[0m        \033[1;33m~~ Wash. Dry. Deliver. With Style. ~~\033[0m          \033[36m|\033[0m\n";
    cout << "   \033[36m|\033[0m                                                          \033[36m|\033[0m\n";
    cout << "   \033[36m|\033[0m   \033[1;37m.------. .------. .------. .------. .------. .------.\033[0m \033[36m|\033[0m\n";
    cout << "   \033[36m|\033[0m   \033[1;37m|LAUNDR| |Y SHOP| | MANA | |GEMEN | |T SYS | |TEM ! |\033[0m \033[36m|\033[0m\n";
    cout << "   \033[36m|\033[0m   \033[1;37m'------' '------' '------' '------' '------' '------'\033[0m \033[36m|\033[0m\n";
    cout << "   \033[36m|\033[0m                                                          \033[36m|\033[0m\n";
    cout << "   \033[36m|\033[0m         \033[35m>> Bubbles  >>  Spin  >>  Fresh & Clean <<\033[0m       \033[36m|\033[0m\n";
    cout << "   \033[36m|\033[0m                                                          \033[36m|\033[0m\n";
    cout << "   \033[36m+----------------------------------------------------------+\033[0m\n";
    cout << "\n";
    cout << "   \033[90mInitializing system";
    for(int i = 0; i < 3; i++) { cout << "."; cout.flush(); }
    cout << "\033[0m\n\n";

    // Load data from files (File Stream)
    loadAllData();
    pauseScreen();

    bool running = true;
    while (running) {           // LOOP: main program loop
        clearScreen();

        // ── HEADER ───────────────────────────────────────────────────
        cout << "\n";
        cout << "   \033[1;36m╔══════════════════════════════════════════════════════╗\033[0m\n";
        cout << "   \033[1;36m║\033[0m  \033[1;33m  ◈  DJ LAUNDRY SHOP MANAGEMENT SYSTEM  ◈         \033[0m\033[1;36m║\033[0m\n";
        cout << "   \033[1;36m║\033[0m  \033[90m       ~ Fresh Clothes, Happy Customers ~          \033[0m\033[1;36m║\033[0m\n";
        cout << "   \033[1;36m╠══════════════════════════════════════════════════════╣\033[0m\n";

        // ── MENU ITEMS ───────────────────────────────────────────────
        cout << "   \033[1;36m║\033[0m                                                      \033[1;36m║\033[0m\n";
        cout << "   \033[1;36m║\033[0m   \033[1;37m[ 1 ]\033[0m  \033[34m👕  Customer Information                    \033[0m\033[1;36m║\033[0m\n";
        cout << "   \033[1;36m║\033[0m                                                      \033[1;36m║\033[0m\n";
        cout << "   \033[1;36m║\033[0m   \033[1;37m[ 2 ]\033[0m  \033[34m🌀  Laundry Status Tracking                 \033[0m\033[1;36m║\033[0m\n";
        cout << "   \033[1;36m║\033[0m                                                      \033[1;36m║\033[0m\n";
        cout << "   \033[1;36m║\033[0m   \033[1;37m[ 3 ]\033[0m  \033[34m💳  Payment System                          \033[0m\033[1;36m║\033[0m\n";
        cout << "   \033[1;36m║\033[0m                                                      \033[1;36m║\033[0m\n";
        cout << "   \033[1;36m║\033[0m   \033[1;37m[ 4 ]\033[0m  \033[34m🧾  Claim Receipt                           \033[0m\033[1;36m║\033[0m\n";
        cout << "   \033[1;36m║\033[0m                                                      \033[1;36m║\033[0m\n";
        cout << "   \033[1;36m║\033[0m   \033[1;37m[ 5 ]\033[0m  \033[34m🧴  Inventory & Detergent Monitoring        \033[0m\033[1;36m║\033[0m\n";
        cout << "   \033[1;36m║\033[0m                                                      \033[1;36m║\033[0m\n";
        cout << "   \033[1;36m║\033[0m   \033[1;37m[ 6 ]\033[0m  \033[31m🚪  Exit                                    \033[0m\033[1;36m║\033[0m\n";
        cout << "   \033[1;36m║\033[0m                                                      \033[1;36m║\033[0m\n";

        // ── FOOTER ───────────────────────────────────────────────────
        cout << "   \033[1;36m╠══════════════════════════════════════════════════════╣\033[0m\n";
        cout << "   \033[1;36m║\033[0m  \033[90m  Tip: Enter the number of your choice below.       \033[0m\033[1;36m║\033[0m\n";
        cout << "   \033[1;36m╚══════════════════════════════════════════════════════╝\033[0m\n";
        cout << "\n   \033[1;33m  ➤  Enter Choice [1-6]: \033[0m";

        int choice;
        cin >> choice;

        // Validate choice (Decision diamond)
        if (choice < 1 || choice > 6) {
            cout << "\n   \033[1;31m  ✖  Invalid choice! Please enter 1-6.\033[0m\n";
            pauseScreen();
            continue;   // loop back (No branch)
        }

        // Valid choice – route to module (Yes branch)
        switch (choice) {
            case 1: module1_CustomerInformation();    break;
            case 2: module2_LaundryStatusTracking();  break;
            case 3: module3_PaymentSystem();           break;
            case 4: module4_ClaimReceipt();            break;
            case 5: module5_InventoryMonitoring();     break;
            case 6: module6_Exit(); running = false;   break;
        }

        if (running) {
            pauseScreen();
        }
    }

    // Free heap memory (Pointers)
    delete[] customers;
    delete[] laundries;
    delete[] payments;
    delete[] inventory;

    return 0;
}
